// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract UniversalAdapter is ChainlinkClient {
  using Chainlink for Chainlink.Request;
  LinkTokenInterface internal immutable linkToken;

  uint constant public REQUEST_COST_IN_JULES = 100;
  // number of nodes allowed to send responses (This has been tested with a maximum of 48 nodes)
  uint constant private NUMBER_OF_NODES = 3;
  // number of responses required to conclude a round (32 max for maximum gas efficency per response)
  uint constant private RESPONSE_THRESHOLD = 3;
  uint constant private BASE_REWARD = (REQUEST_COST_IN_JULES / 2) / RESPONSE_THRESHOLD;
  uint constant private MIN_GAS_FOR_CALLBACK = 100000; //solhint-disable-line var-name-mixedcase
  uint40 constant private EXPIRATION_TIME_IN_SECONDS = 10000;
  bytes32 constant private HASHED_RESPONSE_JOBSPEC = "134dc9324dcd4ec0a81161b5a1670241";
  bytes32 constant private UNHASHED_RESPONSE_JOBSPEC = "c93c7da6ae604267be76f165870d12b1";

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

  struct Round {
    uint40 expirationTime;
    address callbackAddress;
    bytes4 callbackFunctionId;
    uint8 hashedResponseCount;
    bytes8[NUMBER_OF_NODES] hashedAnswers;
    uint8 unhashedResponseCount;
    uint8[RESPONSE_THRESHOLD] nodeIdsSortedByAnswer;
    // mapping from a nodeId to the node's unhashed answer
    mapping(uint8 => bytes32) answers;
  }

  // number of requests sent to the Universal Adapter
  uint private requestCount;
  // mapping from requestId to Round
  mapping(bytes32 => Round) private rounds;
  // A nodeId is used to uniquely identify a node using only 1 byte
  mapping(address => uint8) private nodeIds;
  // mapping from nodeId to addres
  mapping(uint8 => address) private nodeAddresses;
  // mapping from a nodeId to the withdrawable LINK balance
  mapping(uint8 => uint) public balance;
  // mapping from msg.sender to the nodeId from which the withdrawer can collect payment
  mapping(address => uint8) private withdrawableAccount;

  constructor(
    address _link,
    address[] memory nodes,
    address[] memory paymentCollectors
  ) {
    require(nodes.length < 255, "too many");
    require(
      nodes.length == NUMBER_OF_NODES &&
      paymentCollectors.length == NUMBER_OF_NODES,
      "wrong array length"
    );
    for (uint8 i = 0; i < nodes.length; i++) {
      uint8 nodeId = i + 1;
      nodeIds[nodes[i]] = nodeId;
      nodeAddresses[nodeId] = nodes[i];
      withdrawableAccount[paymentCollectors[i]] = nodeId;
    }
    setChainlinkToken(_link);
    linkToken = LinkTokenInterface(_link);
  }

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
      request.add("ref", ref);
    }
    return sendOracleRequest(callbackFunctionId, request);
  }

  function sendOracleRequest(
    bytes4 callbackFunctionId,
    Chainlink.Request memory request
  ) internal returns (bytes32 _requestId) {
    // TODO do we actually need to do keccak and get a hash or can we use requestCount as the requestID
    //bytes32 requestId = keccak256(abi.encodePacked(msg.sender, requestCount));
    requestCount++;
    bytes32 requestId = bytes32(requestCount);
    rounds[requestId].callbackAddress = msg.sender;
    rounds[requestId].callbackFunctionId = callbackFunctionId;
    // solhint-disable-next-line not-rely-on-time
    uint40 expiration = EXPIRATION_TIME_IN_SECONDS + uint40(block.timestamp);
    rounds[requestId].expirationTime = expiration;
    emit OracleRequest(HASHED_RESPONSE_JOBSPEC, msg.sender, requestId, 0,
      msg.sender, callbackFunctionId, uint(expiration), 1, request.buf.buf
    );
    return requestId;
  }

  function respondWithHashedAnswer(
    bytes32 requestId,
    bytes8 hashedAnswer
  ) external {
    require(
      rounds[requestId].expirationTime != 0 &&
      rounds[requestId].unhashedResponseCount == 0,
      "too late"
    );
    // solhint-disable-next-line not-rely-on-time
    if (rounds[requestId].expirationTime < block.timestamp) {
      delete rounds[requestId];
      return;
    }
    uint8 nodeId = nodeIds[msg.sender];
    require(nodeId != 0, "unauthorized");
    require(rounds[requestId].hashedAnswers[nodeId - 1] == 0, "already responded");
    rounds[requestId].hashedAnswers[nodeId - 1] = hashedAnswer;
    rounds[requestId].hashedResponseCount++;
    if (rounds[requestId].hashedResponseCount == RESPONSE_THRESHOLD) {
      requestUnhashedAnswers(requestId);
    }
  }

  function requestUnhashedAnswers(
    bytes32 requestId
  ) internal {
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

  function respondWithUnhashedAnswer(
    bytes32 requestId,
    bytes32 salt,
    bytes32 answer
  ) external returns (bool isSuccessful) {
    require(rounds[requestId].expirationTime != 0, "too late");
    if (rounds[requestId].expirationTime < block.timestamp) { // solhint-disable-line not-rely-on-time
      delete rounds[requestId];
      return false;
    }
    uint8 nodeId = nodeIds[msg.sender];
    require(rounds[requestId].hashedResponseCount >= RESPONSE_THRESHOLD, "too soon");
    // verify the answer matches the hashedAnswer
    require(
      bytes32(keccak256(abi.encodePacked(uint(answer) + uint(salt)))) & 0x000000000000000000000000000000000000000000000000ffffffffffffffff
      == bytes32(rounds[requestId].hashedAnswers[nodeId - 1]) >> 192,
      "hash doesn't match"
    );
    // delete the hashedAnswer to prevent a duplicate response
    delete rounds[requestId].hashedAnswers[nodeId - 1];
    insertAnswerInOrder(requestId, answer);
    // pay the responder their base reward
    balance[nodeIds[msg.sender]] += BASE_REWARD;
    // if the response threshold has been reached,
    // get the median answer, distribute bonuse rewards and execute callback
    if (rounds[requestId].unhashedResponseCount == RESPONSE_THRESHOLD) {
      // calculate the median
      // TODO get printout of answer array (must be done off-chain) to check that insertAnswerInOrder works
      bytes32 medianAnswer = getMedianAndDistributeBonusReward(requestId);
      // clean up
      address callbackAddress = rounds[requestId].callbackAddress;
      bytes4 callbackFunctionId = rounds[requestId].callbackFunctionId;
      delete(rounds[requestId]);
      // call the Requester's callback
      require(gasleft() >= MIN_GAS_FOR_CALLBACK, "Not enough gas");
      (bool success, ) = callbackAddress.call( // solhint-disable-line avoid-low-level-calls
        abi.encodeWithSelector(
          callbackFunctionId,
          requestId,
          medianAnswer
        )
      );
      return success;
    }
    return true;
  }

  // logic is faulty
  function insertAnswerInOrder(
    bytes32 requestId,
    bytes32 answer
  ) internal {
    uint8 nodeId = nodeIds[msg.sender];
    rounds[requestId].answers[nodeId] = answer;
    uint start = 0;
    // the end index is exclusive
    uint end = rounds[requestId].unhashedResponseCount;
    uint middle = rounds[requestId].unhashedResponseCount / 2;
    while (true) {
      if (start == end) {
        break;
      }
      uint8 nodeIdAtIndex = rounds[requestId].nodeIdsSortedByAnswer[middle];
      bytes32 answerAtIndex = rounds[requestId].answers[nodeIdAtIndex];
      if (uint(answer) < uint(answerAtIndex)) {
        end = middle;
      } else {
        start = middle + 1;
      }
      middle = start + (end - start) / 2;
    }
    // shift the rest of the array forward by one index
    for (uint indexOffset = 1; indexOffset <= (rounds[requestId].unhashedResponseCount - start); indexOffset++) {
      rounds[requestId].nodeIdsSortedByAnswer[rounds[requestId].unhashedResponseCount - indexOffset + 1] =
        rounds[requestId].nodeIdsSortedByAnswer[rounds[requestId].unhashedResponseCount - indexOffset];
    }
    // add the nodeId at its correct postion to maintain order
    rounds[requestId].nodeIdsSortedByAnswer[start] = nodeId;
    rounds[requestId].unhashedResponseCount++;
  }

  function getMedianAndDistributeBonusReward(
    bytes32 requestId
  ) internal returns (bytes32 median) {
    uint medianIndex = RESPONSE_THRESHOLD / 2;
    uint8 medianNodeId = rounds[requestId].nodeIdsSortedByAnswer[medianIndex];
    bytes32 medianAnswer = rounds[requestId].answers[medianNodeId];
    // find all nodes with an answer matching the median
    uint8[RESPONSE_THRESHOLD] memory nodeIdsWithMedian;
    nodeIdsWithMedian[0] = medianNodeId;
    uint numNodesWithMedian = 1;
    int leftIndex = int(medianIndex) - 1;
    uint rightIndex = medianIndex + 1;
    while (leftIndex >= 0 || rightIndex < RESPONSE_THRESHOLD) {
      if (leftIndex >= 0) {
        uint8 leftNodeId = rounds[requestId].nodeIdsSortedByAnswer[uint(leftIndex)];
        if (rounds[requestId].answers[leftNodeId] == medianAnswer) {
          nodeIdsWithMedian[numNodesWithMedian] = leftNodeId;
          numNodesWithMedian++;
          leftIndex--;
        } else { leftIndex = -1; }
      }
      if (rightIndex < RESPONSE_THRESHOLD) {
        uint8 rightNodeId = rounds[requestId].nodeIdsSortedByAnswer[uint(rightIndex)];
        if (rounds[requestId].answers[rightNodeId] == medianAnswer) {
          nodeIdsWithMedian[numNodesWithMedian] = rightNodeId;
          numNodesWithMedian++;
          rightIndex++;
        } else { rightIndex = RESPONSE_THRESHOLD; }
      }
    }
    // pay a bonus to all oracles with an answer matching the median
    uint bonusReward = uint(REQUEST_COST_IN_JULES / 2) / numNodesWithMedian;
    for (uint i = 0; i < numNodesWithMedian; i++) {
      balance[nodeIdsWithMedian[i]] += bonusReward;
    }
    return medianAnswer;
  }

  function withdrawEarnings()
  external {
    linkToken.transfer(msg.sender, balance[withdrawableAccount[msg.sender]]);
  }
}