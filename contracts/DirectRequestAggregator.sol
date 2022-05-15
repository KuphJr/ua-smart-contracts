// "SPDX-License-Identifier: MIT"
pragma solidity >=0.7.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.6/LinkTokenReceiver.sol";
import "@chainlink/contracts/src/v0.6/vendor/SafeMathChainlink.sol";
import "@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.6/interfaces/WithdrawalInterface.sol";

contract DirectRequestAggregator is ChainlinkClient {
  using SafeMathChainlink for uint256;
  using Chainlink for Chainlink.Request;

  uint constant private MINIMUM_CONSUMER_GAS_LIMIT = 400000;

  bytes32[] public jobSpecs;
  address[] public oracles;
  uint8 public minResponses;
  uint public linkCostInJules;
  uint public expirationTimeInSeconds;
  uint public roundNum = 1;

  struct OracleRequest {
    address oracle;
    bool hasAnswered;
  }

  struct OracleResponse {
    address oracle;
    bytes32 answer;
  }
  
  struct Round {
    uint expiration;
    address callbackAddress;
    bytes4 callbackFunctionId;
    Chainlink.Request request;
    bytes32[] requestIds;
    mapping(bytes32 => OracleRequest) oracleRequests;
    OracleResponse[] oracleResponses;
  }

  // mapping from requestId to roundId
  mapping(bytes32 => uint) public roundIds;
  // mapping from roundId to Round
  mapping(uint => Round) public rounds;

  constructor(
    address _link,
    address[] _oracles,
    bytes32[] _jobSpecs,
    uint _linkCostInJules,
    uint _expirationTimeInSeconds
  ) {
    require(
      _oracles.length <= 255 && _oracles.length = _jobSpecs.lenght,
      "Invalid initialization"
    );
    linkTokenContract = LinkTokenInterface(_link);
    jobSpec = _jobSpec;
    minResponses = _oracles.length.mul(2).div(3);
    oracles = _oracles;
    for (uint8 i = 0; i < _oracles.length; i++) {
      
    }
    linkCostInJules = _linkCostInJules;
    expirationTimeInSeconds = _expirationTimeInSeconds;
  }

  function makeRequest(
    address callbackAddress,
    bytes4 callbackFunctionId,
    string calldata js,
    string calldata cid,
    string calldata vars,
    bytes32 ref
  ) external {
    // array of the ids of the requests that were sent to each oracle in the DON
    bytes32[] requestIds;
    // mapping from requestIds to oracleRequests
    mapping(bytes32 => OracleRequest) oracleRequests;
    for (uint8 i = 0; i < oracles.length; i++) {
      Chainlink.Request memory request;
      request = buildChainlinkRequest(
        jobSpecs[i],
        this,
        this.fulfillRequest.selector
      );
      request.add(req, msg.sender);
      if (js != "" ) {
        request.add("js", js);
      }
      else if (cid != "") {
        request.add("cid", cid);
      }
      if (vars != "") {
        request.add("vars", vars);
      }
      if (ref != "") {
        request.add("vars", vars);
      }
      requestId = sendChainlinkRequestTo(oracles[i], request, 0);
      oracleRequests[requestId] = OracleRequest(oracles[i], false);
      roundIds[requestId] = roundNum;
      requestIds.push(requestId);
    }
    rounds[roundNum] = Round(
      // solhint-disable-next-line not-rely-on-time
      block.timestamp.add(expirationTimeInSeconds),
      callbackAddress,
      callbackFunctionId,
      request,
      requestIds,
      oracleRequests,
      []
    );
  }

  function fulfillRequest(
    bytes32 requestId,
    bytes32 answer
  )
  external
  checkExpiration(requestId)
  ensureAuthorizedResponse(requestId)
  {
    addResponseInOrder(msg.sender, answer);
    if (round.oracleResponses.length >= minResponses) {
      completeRequest(rounds[roundIds[requestId]]);
    }
  }

  function addResponseInOrder(
    address oracle,
    bytes32 answer
  ) internal {
    Round round = rounds[roundIds[requestId]];
    round.oracleRequests[requestId].hasAnswered = true;
    for (uint i = 0; i < oracleResponses.length; i++) {
      if (answer < oracleResponses[i].answer) {
        oracleResponses.push(oracleResponses[oracleResponses.length-1]);
        for (uint j = i; j < oracleResponses.length - 1; j++) {
          oracleResponses[j+1] = oracleResponses[j];
        }
        oracleResponses[i] = OracleResponse(oracle, answer);
        return;
      }
    }
    round.oracleResponses.push(
      OracleResponse(oracle, answer)
    );
  }

  function completeRequest(
    uint roundId
  ) internal {
    (address[] oraclesToGetExtraReward, bytes32 answer) = getAggregatedAnswer(roundId);
    distributeRewards(roundId, oraclesToGetExtraReward);
    address callbackAddress = rounds[roundId].callbackAddress;
    bytes4 callbackFunctionId = rounds[roundId].callbackFunctionId;
    cleanUpRequest();
    require(gasleft() >= MINIMUM_CONSUMER_GAS_LIMIT, "Not enough gas");
    (bool success, ) = callbackAddress.call( // solhint-disable-line avoid-low-level-calls
      abi.encodeWithSelector(callbackFunctionId, answer)
    );
    return success;
  }

  function getAggregatedAnswer(
    uint roundId
  ) internal
  returns (
    address[] oraclesToGetExtraReward,
    bytes32 answer
  ) {
    OracleResponse[] oracleResponses =  rounds[roundId].oracleResponses;
    uint medianIndex = oracleResponses.length.div(2);
    OracleResponse medianAnswer = oracleResponses[medianIndex].answer;
    address[] oraclesToGetExtraReward = [ oracleResponses[medianIndex].oracle ];
    bool contLeft = true;
    bool contRight = true;
    uint leftIndex = medianIndex.sub(1);
    uint rightIndex = medianIndex.add(1);
    while (contLeft || contRight) {
      if (
        contLeft &&
        leftIndex >= 0 &&
        oracleResponses[leftIndex].answer == medianAnswer
      ) {
        oraclesToGetExtraReward.push(oracleResponses[leftIndex].oracle);
        leftIndex.sub(1);
        contLeft = true;
      } else {
        contLeft = false;
      }
      if (
        contRight &&
        rightIndex < oracleResponses.length &&
        oracleResponses[rightIndex].answer == medianAnswer
      ) {
        oraclesToGetExtraReward.push(oracleResponses[rightIndex].oracle);
        rightIndex.add(1);
        contRight = true;
      } else {
        contRight = false;
      }
    }
    return (oraclesToReward, medianAnswer);
  }

  function distributeRewards(
    uint roundId,
    address[] oraclesToGetExtraReward
  ) internal {
    mapping(address => uint) rewardAmount;
    OracleResponse[] oracleResponses =  rounds[roundId].oracleResponses;
    uint baseReward = linkCostInJules.div(2).div(oracleResponses.length);
    for (uint i = 0; i < oracleResponses.length; i++) {
      rewardAmount[oracleResponses[i].oracle] = baseReward;
    }
    uint extraReward = linkCostInJules.div(2).div(oraclesToGetExtraReward.length);
    for (uint i = 0; i < oraclesToGetExtraReward.length; i++) {
      rewardAmount[oraclesToGetExtraReward[i].oracle].add(extraReward);
    }
    for (uint i = 0; i < oracleResponses.length; i++) {
      LinkTokenInterface.transferFrom(
        address(this),
        oracleResponses[i].oracle,
        rewardAmount[oracleResponses[i].oracle]
      );
    }
  }

  function cleanUpRequest(
    bytes32 requestId
  ) internal {
    delete rounds[roundIds[requestId]];
    delete roundIds[requestId];
  }

  modifier checkExpiration(
    bytes32 requestId
  ) {
    // solhint-disable-next-line not-rely-on-time
    if (block.timestamp > rounds[roundIds[requestId]].expiration) {
      cleanUpRequest(requestId);
      return;
    }
    _;
  }

  modifier ensureAuthorizedResponse(
    bytes32 requestId
  ) {
    Round round = rounds[roundIds[requestId]];
    OracleRequest oracleRequest = round.oracleRequests[requestId];
    require(oracleRequest.oracle == msg.sender, "Incorrect requestId");
    require(oracleRequest.hasAnswered == false, "Alreaded answered");
    _;
  }
}