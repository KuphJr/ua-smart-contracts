// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

contract UniversalAdapter is ChainlinkClient {
  using Chainlink for Chainlink.Request;
  LinkTokenInterface internal immutable linkToken;

  uint constant public REQUEST_COST_IN_JULES = 100;
  // number of nodes allowed to send responses (This has been tested with a maximum of 48 nodes)
  uint constant private NUMBER_OF_NODES = 5;
  // number of responses required to conclude a round (32 max for maximum gas efficency per response)
  uint constant private RESPONSE_THRESHOLD = 3;
  uint constant private BASE_REWARD = (REQUEST_COST_IN_JULES / 2) / NUMBER_OF_NODES;
  uint constant private MIN_GAS_FOR_CALLBACK = 100000; //solhint-disable-line var-name-mixedcase
  uint40 constant private EXPIRATION_TIME_IN_SECONDS = 10000;
  bytes32 constant private HASHED_RESPONSE_JOBSPEC = "134dc9324dcd4ec0a81161b5a1670242"; // make new jobspec
  bytes32 constant private UNHASHED_RESPONSE_JOBSPEC = "c93c7da6ae604267be76f165870d12b0"; // make new jobspec

  event OracleRequest(
    bytes32 indexed specId,
    address requester,
    uint requestId,
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

  struct PublicVars {
    string[] keys;
    string[] values;
  }

  struct EncryptedPrivateVars {
    string[] keys;
    bytes[NUMBER_OF_NODES][] encryptedValuesByNodeId;
  }

  // number of requests sent to the Universal Adapter
  uint private requestCount;
  // mapping from requestId to Round
  mapping(uint => Round) private rounds;
  // A nodeId is used to uniquely identify a node using only 1 byte
  mapping(address => uint8) private nodeIds;
  // mapping from nodeId to addres
  mapping(uint8 => address) private nodeAddresses;
  // mapping from nodeId to address which receives payment
  mapping(uint8 => address) private paymentCollectors;
  // mapping from nodeAdmin address to nodeId for which the admin is authorized
  mapping(address => uint8) private adminToNodeId;
  mapping(uint8 => address) private nodeIdToAdmin;
  // mapping from nodeId to the node's publicKey for encrypting EncryptedPrivateVars
  mapping(uint8 => bytes) public nodePublicKeys;
  // mapping from a voteHash to the number of votes in favor of swapping a node
  mapping(bytes32 => bool[NUMBER_OF_NODES]) public swapVotes;

  constructor(
    address _link,
    address[] memory _nodeAddresses,
    address[] memory _paymentCollectors,
    address[] memory _nodeAdmins,
    bytes[] memory _publicKeys
  ) {
    require(_nodeAddresses.length < 255, "too many");
    require(
      _nodeAddresses.length == NUMBER_OF_NODES &&
      _paymentCollectors.length == NUMBER_OF_NODES &&
      _publicKeys.length == NUMBER_OF_NODES,
      "wrong array length"
    );
    for (uint8 i = 0; i < _nodeAddresses.length; i++) {
      uint8 nodeId = i + 1;
      nodeIds[_nodeAddresses[i]] = nodeId;
      adminToNodeId[_nodeAdmins[i]] = nodeId;
      nodeIdToAdmin[nodeId] = _nodeAdmins[i];
      nodeAddresses[nodeId] = _nodeAddresses[i];
      paymentCollectors[nodeId] = _paymentCollectors[i];
    }
    setChainlinkToken(_link);
    linkToken = LinkTokenInterface(_link);
  }

  function makeRequest(
    bytes4 callbackFunctionId,
    string memory source,
    bytes32 checksum,
    PublicVars memory publicVars,
    EncryptedPrivateVars memory privateVars
  ) external returns (uint _requestId) {
    linkToken.transferFrom(msg.sender, address(this), REQUEST_COST_IN_JULES);
    Chainlink.Request memory request;
    request = buildChainlinkRequest(
      HASHED_RESPONSE_JOBSPEC,
      address(this),
      this.respondWithHashedAnswer.selector
    );
    request.add("s", source);
    request.addUint("c", uint(checksum));
    request.addBytes("u", abi.encode(publicVars));
    request.addBytes("r", abi.encode(privateVars));
    return sendOracleRequest(callbackFunctionId, request);
  }

  function sendOracleRequest(
    bytes4 callbackFunctionId,
    Chainlink.Request memory request
  ) internal returns (uint _requestId) {
    requestCount++;
    rounds[requestCount].callbackAddress = msg.sender;
    rounds[requestCount].callbackFunctionId = callbackFunctionId;
    // solhint-disable-next-line not-rely-on-time
    uint40 expiration = EXPIRATION_TIME_IN_SECONDS + uint40(block.timestamp);
    rounds[requestCount].expirationTime = expiration;
    emit OracleRequest(HASHED_RESPONSE_JOBSPEC, msg.sender, requestCount, 0,
      msg.sender, callbackFunctionId, uint(expiration), 1, request.buf.buf
    );
    return requestCount;
  }

  function respondWithHashedAnswer(
    uint requestId,
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
    // pay the responder their base reward
    linkToken.transfer(paymentCollectors[nodeId], BASE_REWARD);
  }

  function requestUnhashedAnswers(
    uint requestId
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
    uint requestId,
    bytes32 salt,
    bytes32 answer
  ) external returns (bool isSuccessful) {
    require(rounds[requestId].expirationTime != 0, "too late");
    // solhint-disable-next-line not-rely-on-time
    if (rounds[requestId].expirationTime < block.timestamp) {
      delete rounds[requestId];
      return false;
    }
    uint8 nodeId = nodeIds[msg.sender];
    require(rounds[requestId].hashedResponseCount >= RESPONSE_THRESHOLD, "too soon");
    // verify the answer matches the hashedAnswer
    require(
      bytes32(keccak256(abi.encodePacked(uint(answer) + uint(salt))))
      & 0x000000000000000000000000000000000000000000000000ffffffffffffffff
      == bytes32(rounds[requestId].hashedAnswers[nodeId - 1]) >> 192,
      "hash doesn't match"
    );
    // delete the hashedAnswer to prevent a duplicate response
    delete rounds[requestId].hashedAnswers[nodeId - 1];
    insertAnswerInOrder(requestId, answer);
    // if the response threshold has been reached,
    // get the median answer, distribute bonuse rewards and execute callback
    if (rounds[requestId].unhashedResponseCount == RESPONSE_THRESHOLD) {
      // calculate the median
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
    uint requestId,
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
    uint responders = rounds[requestId].unhashedResponseCount;
    for (uint indexOffset = 1; indexOffset <= (responders - start); indexOffset++) {
      rounds[requestId].nodeIdsSortedByAnswer[responders - indexOffset + 1] =
        rounds[requestId].nodeIdsSortedByAnswer[responders - indexOffset];
    }
    // add the nodeId at its correct postion to maintain order
    rounds[requestId].nodeIdsSortedByAnswer[start] = nodeId;
    rounds[requestId].unhashedResponseCount++;
  }

  function getMedianAndDistributeBonusReward(
    uint requestId
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
    // totalRewardPool = requestCost - baseReward * numberOfHashedResponses
    uint bonusReward = uint(
      (REQUEST_COST_IN_JULES - BASE_REWARD * rounds[requestId].hashedResponseCount)
      / numNodesWithMedian
    );
    for (uint i = 0; i < numNodesWithMedian; i++) {
      linkToken.transfer(paymentCollectors[nodeIdsWithMedian[i]], bonusReward);
    }
    return medianAnswer;
  }

  // vote to swap a node for another node.  When RESPONSE_THRESHOLD number of identical votes are recieved,
  // the node is swapped
  function voteToSwap(
    uint8 nodeId,
    address newNodeAddress,
    address newPaymentCollector,
    address newAdmin,
    bytes calldata publicKey
  ) public onlyNodeAdmins returns (bool swapOccurred) {
    bytes32 voteHash = keccak256(abi.encodePacked(nodeId, newPaymentCollector, newNodeAddress, publicKey));
    require(swapVotes[voteHash][adminToNodeId[msg.sender]-1] == false, "Only one vote");
    // minus one because nodeIds start at 1 index and arrays start with a zero index
    swapVotes[voteHash][adminToNodeId[msg.sender]-1] = true;
    uint numVotes = 0;
    for (uint i = 0; i < NUMBER_OF_NODES; i++) {
      if (swapVotes[voteHash][i]) {
        numVotes++;
      }
    }
    if (numVotes == RESPONSE_THRESHOLD) {
      // delete mapping from nodeAddress to nodeId so the old node is no longer allowed to respond
      delete nodeIds[nodeAddresses[nodeId]];
      // delete admin so it no longer has authorization to perform actions
      delete adminToNodeId[nodeIdToAdmin[nodeId]];
      nodeIdToAdmin[nodeId] = newAdmin;
      adminToNodeId[newAdmin] = nodeId;
      nodeIds[newNodeAddress] = nodeId;
      nodeAddresses[nodeId] = newNodeAddress;
      paymentCollectors[nodeId] = newPaymentCollector;
      nodePublicKeys[nodeId] = publicKey;
      delete swapVotes[voteHash];
      return true;
    }
    return false;
  }

  function setPublicKey(bytes calldata publicKey) public onlyNodeAdmins {
    nodePublicKeys[adminToNodeId[msg.sender]] = publicKey;
  }

  function setNodeAddress(address newNodeAddress) public onlyNodeAdmins {
    delete nodeIds[nodeAddresses[adminToNodeId[msg.sender]]];
    nodeIds[newNodeAddress] = adminToNodeId[msg.sender];
    nodeAddresses[adminToNodeId[msg.sender]] = newNodeAddress;
  }

  modifier onlyNodeAdmins {
    require(adminToNodeId[msg.sender] != 0, "Unauthorized");
    _;
  }
}