// "SPDX-License-Identifier: MIT"
pragma solidity <=0.8.0;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.7/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol";

pragma experimental ABIEncoderV2;

contract DirectRequestAggregator is ChainlinkClient{
  using Chainlink for Chainlink.Request;
  LinkTokenInterface internal immutable linkToken;

  uint public minGasForCallback;

  bytes32 public hashedResponseJobspec;
  bytes32 public unhashedResponseJobspec;
  address[] public oracles;
  uint public minResponses;
  uint public linkCostInJules;
  uint public expirationTimeInSeconds;
  uint public roundNum = 1;

  struct OracleRequest {
    address oracle;
    bool hasResponded;
  }

  struct UnhashedResponse {
    address oracle;
    bytes32 unhashedAnswer;
  }
  
  struct Round {
    uint expiration;
    address callbackAddress;
    bytes4 callbackFunctionId;
    Chainlink.Request request;
    bytes32[] requestIds;
    address[] hashedResponders;
    UnhashedResponse[] unhashedResponses;
    // mapping from requestId to OracleRequest
    mapping(bytes32 => OracleRequest) hashedOracleRequests;
    mapping(address => bytes32) hashedAnswers;
    mapping(bytes32 => OracleRequest) unhashedOracleRequests;
  }

  // mapping from requestId to roundId
  mapping(bytes32 => uint) public roundIds;
  // mapping from roundId to Round
  mapping(uint => Round) public rounds;

  constructor(
    address _link,
    bytes32 _hashedResponseJobspec,
    bytes32 _unhashedResponseJobspec,
    address[] memory _oracles,
    uint _minResponses,
    uint _linkCostInJules,
    uint _expirationTimeInSeconds,
    uint _minGasForCallback
  ) {
    require(
      _oracles.length < 128,
      "Invalid initialization"
    );
    setChainlinkToken(_link);
    linkToken = LinkTokenInterface(_link);
    minResponses = _minResponses;
    if (minResponses == 0) {
      minResponses = 1;
    }
    hashedResponseJobspec = _hashedResponseJobspec;
    unhashedResponseJobspec =_unhashedResponseJobspec;
    oracles = _oracles;
    linkCostInJules = _linkCostInJules;
    expirationTimeInSeconds = _expirationTimeInSeconds;
    minGasForCallback = _minGasForCallback;
  }

  function makeRequest(
    address callbackAddress,
    bytes4 callbackFunctionId,
    string calldata js,
    string calldata cid,
    string calldata vars,
    bytes32 ref
  ) external returns (uint roundId) {
    // get payment
    require(
      linkToken.allowance(msg.sender, address(this)) >= linkCostInJules,
      "Not enough LINK"
    );
    linkToken.transferFrom(
      msg.sender,
      address(this),
      linkCostInJules
    );
    Chainlink.Request memory request;
    request = buildChainlinkRequest(
      hashedResponseJobspec,
      address(this),
      this.respondWithHashedAnswer.selector
    );
    request.add("req", addressToString(msg.sender));
    if (bytes(js).length != 0) {
      request.add("js", js);
    }
    else if (bytes(cid).length != 0) {
      request.add("cid", cid);
    }
    if (bytes(vars).length != 0) {
      request.add("vars", vars);
    }
    if (ref != "") {
      request.add("ref", string(abi.encodePacked(ref)));
    }
    roundNum++;
    // solhint-disable-next-line not-rely-on-time
    rounds[roundNum].expiration = block.timestamp + expirationTimeInSeconds;
    rounds[roundNum].callbackAddress = callbackAddress;
    rounds[roundNum].callbackFunctionId = callbackFunctionId;
    rounds[roundNum].request = request;
    bytes32 requestId;
    for (uint i = 0; i < oracles.length; i++) {
      requestId = sendChainlinkRequestTo(oracles[i], request, 0);
      roundIds[requestId] = roundNum;
      rounds[roundNum].requestIds.push(requestId);
      rounds[roundNum].hashedOracleRequests[requestId].oracle = oracles[i];
    }
    return roundNum;
  }

  function addressToString(address _address) public pure returns(string memory) {
    bytes32 _bytes = bytes32(uint256(_address));
    bytes memory hexRep = "0123456789abcdef";
    bytes memory _string = new bytes(42);
    _string[0] = "0";
    _string[1] = "x";
    for(uint i = 0; i < 20; i++) {
        _string[2+i*2] = hexRep[uint8(_bytes[i + 12] >> 4)];
        _string[3+i*2] = hexRep[uint8(_bytes[i + 12] & 0x0f)];
    }
    return string(_string);
  }

  function respondWithHashedAnswer(
    bytes32 requestId,
    bytes32 hashedAnswer
  )
  external
  ensureAuthorizedHashedResponse(requestId)
  checkExpiration(requestId)
  {
    uint roundId = roundIds[requestId];
    rounds[roundId].hashedOracleRequests[requestId].hasResponded = true;
    rounds[roundId].hashedAnswers[msg.sender] = hashedAnswer;
    rounds[roundId].hashedResponders.push(msg.sender);
    if (rounds[roundId].hashedResponders.length == minResponses) {
      requestUnhashedResponses(roundId);
    }
  }

  modifier ensureAuthorizedHashedResponse(
    bytes32 requestId
  ) {
    uint roundId = roundIds[requestId];
    require(rounds[roundId].unhashedResponses.length < minResponses, "Too late");
    require(
      rounds[roundId].hashedOracleRequests[requestId].oracle == msg.sender,
      "Incorrect requestId"
    );
    require(
      rounds[roundId].hashedOracleRequests[requestId].hasResponded == false,
      "Alreaded responded"
    );
    _;
  }

  function requestUnhashedResponses(
    uint roundId
  ) internal {
    Chainlink.Request memory request;
    uint baseReward = uint(linkCostInJules) / uint(minResponses * 2);
    // send request to get a hashed response from all nodes
    for (uint i = 0; i < rounds[roundId].hashedResponders.length; i++) {
      address responder = rounds[roundId].hashedResponders[i];
      request = buildChainlinkRequest(
        unhashedResponseJobspec,
        address(this),
        this.respondWithUnhashedAnswer.selector
      );
      request.add("hash",
        bytes32ToHexString(rounds[roundId].hashedAnswers[responder])
      );
      bytes32 requestId = sendChainlinkRequestTo(responder, request, baseReward);
      roundIds[requestId] = roundId;
      rounds[roundNum].unhashedOracleRequests[requestId].oracle = responder;
      rounds[roundId].requestIds.push(requestId);
    }
  }

  function bytes32ToHexString(bytes32 _bytes32) public pure returns (string memory) {
    uint8 i = 0;
    bytes memory bytesArray = new bytes(64);
    for (i = 0; i < bytesArray.length; i++) {
      uint8 _f = uint8(_bytes32[i/2] & 0x0f);
      uint8 _l = uint8(_bytes32[i/2] >> 4);
      bytesArray[i] = toByte(_l);
      i = i + 1;
      bytesArray[i] = toByte(_f);
    }
    return string(bytesArray);
  }

  function toByte(uint8 _uint8) public pure returns (bytes1 b) {
    if(_uint8 < 10) {
      return bytes1(_uint8 + 48);
    } else {
      return bytes1(_uint8 + 87);
    }
  }

  function respondWithUnhashedAnswer(
    bytes32 requestId,
    uint salt,
    bytes32 unhashedAnswer
  )
  external
  ensureAuthorizedUnhashedResponse(requestId, salt, unhashedAnswer)
  checkExpiration(requestId)
  {
    uint roundId = roundIds[requestId];
    rounds[roundId].unhashedOracleRequests[requestId].hasResponded = true;
    // add responses in order
    uint initalLength = rounds[roundId].unhashedResponses.length;
    uint i = 0;
    for (; i < initalLength; i++) {
      if (unhashedAnswer < rounds[roundId].unhashedResponses[i].unhashedAnswer) {
        rounds[roundId].unhashedResponses.push(
          rounds[roundId].unhashedResponses[rounds[roundId].unhashedResponses.length-1]
        );
        for (uint j = i; j < initalLength; j++) {
          rounds[roundId].unhashedResponses[j+1] = rounds[roundId].unhashedResponses[j];
        }
        rounds[roundId].unhashedResponses[i] = UnhashedResponse({
          oracle: msg.sender,
          unhashedAnswer: unhashedAnswer
        });
        break;
      }
    }
    // if the loop was not broken prematurely,
    // the answer is the largest and is appended to the end of the array
    if (i == initalLength) {
      rounds[roundId].unhashedResponses.push(
        UnhashedResponse({
          oracle: msg.sender,
          unhashedAnswer: unhashedAnswer
        })
      );
    }
    // If the response threshold is reached, distribute rewards
    // and call the callback function of the requester
    if (rounds[roundId].unhashedResponses.length == minResponses) {
      completeRequest(roundIds[requestId]);
    }
  }

  modifier ensureAuthorizedUnhashedResponse(
    bytes32 requestId,
    uint salt,
    bytes32 unhashedAnswer
  ) {
    uint roundId = roundIds[requestId];
    require(rounds[roundId].hashedResponders.length >= minResponses, "Too soon");
    require(rounds[roundId].unhashedOracleRequests[requestId].oracle == msg.sender, "Incorrect requestId");
    require(rounds[roundId].unhashedOracleRequests[requestId].hasResponded == false, "Already responded");
    bytes32 keck = keccak256(abi.encodePacked((uint(unhashedAnswer) / uint(2)) + salt));
    require(
      keccak256(abi.encodePacked((uint(unhashedAnswer) / uint(2)) + salt)) == rounds[roundId].hashedAnswers[msg.sender],
      "Hash doesn't match"
    );
    _;
  }

  function completeRequest(
    uint roundId
  ) internal returns (bool isSuccessful) {
    (address[] memory oraclesToGetMedianReward, bytes32 answer) = getMedianAnswer(roundId);
    distributeMedianRewards(oraclesToGetMedianReward);
    address callbackAddress = rounds[roundId].callbackAddress;
    bytes4 callbackFunctionId = rounds[roundId].callbackFunctionId;
    cleanUpRequest(roundId);
    require(gasleft() >= minGasForCallback, "Not enough gas");
    (bool success, ) = callbackAddress.call( // solhint-disable-line avoid-low-level-calls
      abi.encodeWithSelector(
        callbackFunctionId,
        roundId,
        answer
      )
    );
    return success;
  }

  function getMedianAnswer(
    uint roundId
  ) internal returns (
    address[] memory oraclesToGetExtraReward,
    bytes32 answer
  ) {
    uint medianIndex = rounds[roundId].unhashedResponses.length / 2;
    bytes32 medianAnswer = rounds[roundId].unhashedResponses[medianIndex].unhashedAnswer;
    address[] memory oraclesToGetMedianReward = new address[](rounds[roundId].unhashedResponses.length);
    oraclesToGetMedianReward[0] = rounds[roundId].unhashedResponses[medianIndex].oracle;
    bool contLeft = true;
    bool contRight = true;
    int leftIndex = int(medianIndex) - 1;
    uint rightIndex = medianIndex + 1;
    uint i = 1;
    while (contLeft || contRight) {
      if (
        contLeft &&
        leftIndex >= 0 &&
        rounds[roundId].unhashedResponses[uint(leftIndex)].unhashedAnswer == medianAnswer
      ) {
        oraclesToGetMedianReward[i] = rounds[roundId].unhashedResponses[uint(leftIndex)].oracle;
        i++;
        leftIndex--;
        contLeft = true;
      } else {
        contLeft = false;
      }
      if (
        contRight &&
        rightIndex < rounds[roundId].unhashedResponses.length &&
        rounds[roundId].unhashedResponses[rightIndex].unhashedAnswer == medianAnswer
      ) {
        oraclesToGetMedianReward[i] = rounds[roundId].unhashedResponses[rightIndex].oracle;
        i++;
        rightIndex++;
        contRight = true;
      } else {
        contRight = false;
      }
    }
    address[] memory shortList = new address[](i);
    for (uint j = 0; j < i; j++) {
      shortList[j] = oraclesToGetMedianReward[j];
    }
    return (shortList, medianAnswer);
  }

  function distributeMedianRewards(
    address[] memory oraclesToGetMedianReward
  ) internal {
    uint extraReward = linkCostInJules / (2 * oraclesToGetMedianReward.length);
    for (uint i = 0; i < oraclesToGetMedianReward.length; i++) {
      linkToken.transfer(
        oraclesToGetMedianReward[i],
        extraReward
      );
    }
  }

  function cleanUpRequest(
    uint roundId
  ) internal {
    for (uint i = 0; i < rounds[roundId].requestIds.length; i++) {
      delete roundIds[rounds[roundId].requestIds[i]];
    }
    delete rounds[roundId];
  }

  modifier checkExpiration(
    bytes32 requestId
  ) {
    // solhint-disable-next-line not-rely-on-time
    if (block.timestamp > rounds[roundIds[requestId]].expiration) {
      cleanUpRequest(roundIds[requestId]);
      return;
    }
    _;
  }
}