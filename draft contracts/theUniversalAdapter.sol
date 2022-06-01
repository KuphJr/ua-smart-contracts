// "SPDX-License-Identifier: MIT"
pragma solidity >=0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract TheUniversalAdapter is ChainlinkClient {
  using Chainlink for Chainlink.Request;
  LinkTokenInterface internal immutable linkToken;
  // cost of a request (1 LINK)
  uint constant public REQUEST_COST_IN_JULES = 1000000000000000000;
  // number of responses required to fulfill a Round
  uint constant private RESPONSE_THRESHOLD = 3;
  // base reward sent to each node for a request
  uint constant private BASE_REWARD = (REQUEST_COST_IN_JULES / 2) / RESPONSE_THRESHOLD;
  // required amount of gas to use when executing callback
  uint private MIN_GAS_FOR_CALLBACK; //solhint-disable-line var-name-mixedcase
  // number of seconds until a round is considered expired (5 minutes)
  uint32 constant private EXPIRATION_TIME_IN_SECONDS = 300;
  // the jobspec for getting the hashed answer
  bytes32 constant private HASHED_RESPONSE_JOBSPEC = "3c17c49975b542208a8d7e9ca33408e1";
  // the jobspec for getting the unhashed answer
  bytes32 constant private UNHASHED_RESPONSE_JOBSPEC = "c9e20f09ea874294b1af9e3fb3a38179";

  /* note: These variables are static after contract deployment */
  // mapping from a node address to the withdrawable LINK balance
  mapping(address => uint) public balance;
  // mapping from the wallet allowed to collect payment to the node address
  mapping(address => address) private withdrawer;
  // mapping from each node's address to an index in the response array plus 1
  // (must be non-zero for validating authorized nodes)
  mapping(address => uint) private slotPlus1;
  // mapping from a response array index to the node's address
  mapping(uint => address) private node;

  event OracleRequest(
    bytes32 indexed specId,
    address requester,
    bytes32 requestId,
    uint256 payment,
    address callbackAddr,
    bytes4 callbackFunctionId,
    uint256 cancelExpiration,
    uint256 dataVersion,
    bytes data
  );

  mapping(uint8 => address) nodeAddresses;
  // nodeIds range from 1 to 255
  mapping(address => uint8) nodeIds;

  struct Round{
    uint32 expirationTime;
    address callbackAddress;
    bytes4 callbackFunctionId;
    uint8 hashedResponseCount;
    mapping(uint8 => bytes32) hashedAnswers;
    uint8 unhashedResponseCount;
    uint8[RESPONSE_THRESHOLD] nodeIdsSortedByResponse;
    // mapping from a nodeId to that node's unhashed answer
    mapping(uint8 => bytes32) answers;
  }

  struct RequestParams {
    bytes4 callbackFunctionId;
    string js;
    string cid;
    string vars;
    bytes32 ref;
  }

  uint private requestCount;
  // mapping from requestId to Round
  mapping(bytes32 => Round) private rounds;

  // TODO
  constructor(
    address _link
  ) {
    setChainlinkToken(_link);
    linkToken = LinkTokenInterface(_link);
  }

  // TODO
  function makeRequest(
    bytes4 callbackFunctionId,
    string calldata js,
    string calldata cid,
    string calldata vars,
    string calldata ref
  )
  external returns (bytes32 _requestId) {
    linkToken.transferFrom(msg.sender, address(this), REQUEST_COST_IN_JULES);
    Chainlink.Request memory request;
    request = buildChainlinkRequest(
      HASHED_RESPONSE_JOBSPEC,
      address(this),
      this.respondWithHashedAnswer.selector
    );
    request.addBytes("req", abi.encodePacked(msg.sender));
    if (bytes(js).length != 0) {
      request.add("js", js);
    }
    else if (bytes(cid).length != 0) {
      request.add("cid", cid);
    }
    if (bytes(vars).length != 0) {
      request.add("vars", vars);
    }
    if (bytes(ref).length != 0) {
      request.add("ref", string(ref));
    }
    // when creating round, callbackAddress = msg.sender
    bytes32 requestId = keccak256(abi.encodePacked(msg.sender, requestCount));
    // solhint-disable-next-line not-rely-on-time
    uint expiration = EXPIRATION_TIME_IN_SECONDS + block.timestamp;
    emit OracleRequest(HASHED_RESPONSE_JOBSPEC, msg.sender, requestId, 0,
      msg.sender, callbackFunctionId, expiration, 1, request.buf.buf
    );
    return requestId;
  }

  function respondWithHashedAnswer(bytes32 requestId, bytes32 hashedAnswer)
  external {
    require(rounds[requestId].unhashedResponseCount == 0, "too late");
    // solhint-disable-next-line not-rely-on-time
    if (rounds[requestId].expirationTime < block.timestamp) {
      delete rounds[requestId];
      return;
    }
    uint8 nodeId = nodeIds[msg.sender];
    require(nodeId != 0, "unauthorized");
    require(rounds[requestId].hashedAnswers[nodeId] == 0, "already responded");
    rounds[requestId].hashedAnswers[nodeId] = hashedAnswer;
    rounds[requestId].hashedResponseCount++;
    if (rounds[requestId].hashedResponseCount == RESPONSE_THRESHOLD) {
      requestUnhashedAnswers(requestId);
    }
  }

  function requestUnhashedAnswers(bytes32 requestId)
  internal {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(
        UNHASHED_RESPONSE_JOBSPEC,
        address(this),
        this.respondWithUnhashedAnswer.selector
      );
      emit OracleRequest(UNHASHED_RESPONSE_JOBSPEC, rounds[requestId].callbackAddress, requestId,
        0, rounds[requestId].callbackAddress, rounds[requestId].callbackFunctionId,
        rounds[requestId].expirationTime, 1, request.buf.buf
      );
  }

  function respondWithUnhashedAnswer(bytes32 requestId, uint salt, bytes32 answer)
  external returns (bool isSuccessful) {
    if (rounds[requestId].expirationTime < block.timestamp) { // solhint-disable-line not-rely-on-time
      delete rounds[requestId];
      return false;
    }
    uint8 nodeId = nodeIds[msg.sender];
    require(rounds[requestId].hashedResponseCount >= RESPONSE_THRESHOLD, "too soon");
    // verify the answer matches the hashedAnswer
    require(
      bytes32(keccak256(
        abi.encodePacked(uint(answer) + salt)
      )) == rounds[requestId].hashedAnswers[nodeId],
      "invalid hash"
    );
    // delete the hashedAnswer to prevent a duplicate response
    delete rounds[requestId].hashedAnswers[nodeId];
    insertAnswerInOrder(requestId, answer);
    balance[msg.sender] += BASE_REWARD;
    if (rounds[requestId].nodeIdsSortedByResponse.length == RESPONSE_THRESHOLD) {
      // calculate the median
      bytes32 medianAnswer = getMedian(requestId);
      // clean up
      delete(rounds[requestId]);
      // call the Requester's callback
      require(gasleft() >= MIN_GAS_FOR_CALLBACK, "Not enough gas");
      (bool success, ) = rounds[requestId].callbackAddress.call( // solhint-disable-line avoid-low-level-calls
        abi.encodeWithSelector(
          rounds[requestId].callbackFunctionId,
          requestId,
          medianAnswer
        )
      );
      return success;
    }
    return true;
  }

  function insertAnswerInOrder(bytes32 requestId, bytes32 answer)
  internal {
    uint8 nodeId = nodeIds[msg.sender];
    rounds[requestId].answers[nodeId] = answer;
    uint start = 0;
    // the end index is exclusive
    uint end = rounds[requestId].unhashedResponseCount;
    uint middle = rounds[requestId].unhashedResponseCount / 2;
    while (true) {
      if (end == start) {
        break;
      }
      uint8 nodeIdAtIndex = rounds[requestId].nodeIdsSortedByResponse[middle];
      bytes32 answerAtIndex = rounds[requestId].answers[nodeIdAtIndex];
      if (uint(answer) < uint(answerAtIndex)) {
        end = middle;
      } else {
        start = middle + 1;
      }
      middle = start + (end - start) / 2;
    }
    // shift the rest of the array forward by one index
    for (uint i = start; i < rounds[requestId].unhashedResponseCount; i++) {
      rounds[requestId].nodeIdsSortedByResponse[i + 1] = rounds[requestId].nodeIdsSortedByResponse[i];
    }
    // add the nodeId at its correct postion to maintain order
    rounds[requestId].nodeIdsSortedByResponse[start] = nodeId;
  }

  function getMedian(bytes32 requestId) internal
  returns (bytes32 median) {
    uint medianIndex = RESPONSE_THRESHOLD >> 1;
    bytes32 medianAnswer = rounds[requestId].unhashedResponses[
      rounds[requestId].order[medianIndex]
    ].unhashedAnswer;
    // find all nodes with an answer matching the median
    address[RESPONSE_THRESHOLD] memory nodesWithMedianAnswer;
    nodesWithMedianAnswer[0] = msg.sender;
    bool contLeft = true;
    bool contRight = true;
    int leftIndex = int(medianIndex) - 1;
    uint rightIndex = medianIndex + 1;
    uint numNodesWithMedianAnswer = 1;
    while (contLeft || contRight) {
      if (contLeft && leftIndex >= 0) {
        uint8 sortedOrderLeftIndex = rounds[requestId].order[uint(leftIndex)];
        if (
          rounds[requestId].unhashedResponses[sortedOrderLeftIndex].unhashedAnswer == medianAnswer
        ) {
          nodesWithMedianAnswer[numNodesWithMedianAnswer] = node[sortedOrderLeftIndex];
          numNodesWithMedianAnswer++;
          leftIndex--;
        } else { contLeft = false; }
      }
      if (contRight && rightIndex < RESPONSE_THRESHOLD) {
        uint8 sortedOrderRightIndex = rounds[requestId].order[uint(rightIndex)];
        if (
          rounds[requestId].unhashedResponses[sortedOrderRightIndex].unhashedAnswer == medianAnswer
        ) {
          nodesWithMedianAnswer[numNodesWithMedianAnswer] = node[sortedOrderRightIndex];
          numNodesWithMedianAnswer++;
          rightIndex++;
        } else { contRight = false; }
      }
    }
    // pay all oracles with an answer matching the median a bonus
    uint bonusReward = uint(REQUEST_COST_IN_JULES / 2) / numNodesWithMedianAnswer;
    for (uint i = 0; i < numNodesWithMedianAnswer; i++) {
      balance[nodesWithMedianAnswer[i]] += bonusReward;
    }
    return medianAnswer;
  }

  function withdrawEarnings() external {
    linkToken.transfer(msg.sender, balance[withdrawer[msg.sender]]);
  }
}