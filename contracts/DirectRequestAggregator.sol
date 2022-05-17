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

  uint public minGasForCallback = 400000;

  bytes32 public hashedResponseJobspec;
  bytes32 public unhashedResponseJobspec;
  address[] public oracles;
  uint8 public minResponses;
  uint public linkCostInJules = 1000000000000000000;
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
    address[] _oracles,
    uint _linkCostInJules,
    uint _expirationTimeInSeconds,
    uint _minGasForCallback
  ) {
    require(
      _oracles.length <= 255,
      "Invalid initialization"
    );
    linkTokenContract = LinkTokenInterface(_link);
    minResponses = _oracles.length.mul(2).div(3);
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
  ) external {
    // get payment
    require(
      linkTokenContract.allowance(msg.sender, address(this)) >= linkCostInJules,
      "Not enough LINK"
    );
    linkTokenContract.transferFrom(
      msg.sender,
      address(this),
      linkCostInJules
    );
    Chainlink.Request memory request;
    request = buildChainlinkRequest(
      hashedResponseJobSpec,
      this,
      this.respondWithHashedAnswer.selector
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
      request.add("ref", ref);
    }
    rounds[roundNum] = Round({
      // solhint-disable-next-line not-rely-on-time
      expiration: block.timestamp.add(expirationTimeInSeconds),
      callbackAddress: callbackAddress,
      callbackFunctionId: callbackFunctionId,
      request: request
    });
    bytes32 requestId;
    for (uint8 i = 0; i < oracles.length; i++) {
      requestId = sendChainlinkRequestTo(oracles[i], request, 0);
      roundIds[requestId] = roundNum;
      rounds[roundNum].requestIds.push(requestId);
      rounds[roundNum].hashedOracleRequests[requestId] = OracleRequest({
        oracle: oracles[i]
      });
    }
    roundNum++;
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
    if (rounds[roundId].hashedResponders.length >= minResponses) {
      requestUnhashedResponses(roundIds);
    }
  }

  modifier ensureAuthorizedHashedResponse(
    bytes32 requestId
  ) {
    uint roundId = roundIds[requestId];
    require(rounds[roundId].unhashedResponses.length == 0, "Too late");
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
    // send request to get a hashed response from all nodes
    for (uint8 i = 0; i < rounds[roundId].hashedResponders.length; i++) {
      address responder = rounds[roundId].hashedResponders[i];
      request = buildChainlinkRequest(
        jobSpec,
        this,
        this.respondWithUnhashedAnswer.selector
      );
      request.add("hash", rounds[roundId].hashedAnswers[responder]);
      requestId = sendChainlinkRequestTo(responder, request, 0);
      roundIds[requestId] = roundId;
      round.requestIds.push(requestId);
    }
  }

  function respondWithUnhashedAnswer(
    bytes32 requestId,
    bytes8 salt,
    bytes32 unhashedAnswer
  )
  external
  ensureAuthorizedUnhashedResponse(requestId, salt, unhashedAnswer)
  checkExpiration(requestId)
  {
    uint roundId = roundIds[requestId];
    rounds[roundId].oracleRequests[requestId].hasAnswered = true;
    // add responses in order
    uint8 initalLength = rounds[roundId].unhashedResponses.length;
    for (uint8 i = 0; i < length; i++) {
      if (unhashedAnswer < rounds[roundId].unhashedResponses[i].unhashedAnswer) {
        rounds[roundId].unhashedResponses.push(
          rounds[roundId].unhashedResponses[oracleResponses.length-1]
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
    if (i != initalLength) {
      rounds[roundId].unhashedResponses.push(
        UnhashedResponse({
          oracle: msg.sender,
          unhashedAnswer: unhashedAnswer
        })
      );
    }
    // If the response threshold is reached, distribute rewards
    // and call the callback function of the requester
    if (round.unhashedResponses.length >= minResponses) {
      completeRequest(rounds[roundIds[requestId]]);
    }
  }

  modifier ensureAuthorizedUnhashedResponse(
    bytes32 requestId,
    uint8 salt,
    bytes32 unhashedAnswer
  ) {
    uint roundId = roundIds[requestId];
    require(rounds[roundId].hashedResponders.length >= minResponses, "Too soon");
    require(rounds[roundId].unhashedOracleRequest.oracle == msg.sender, "Incorrect requestId");
    require(rounds[roundId].unhashedOracleRequest.hasResponded == false, "Already responded");
    require(
      keccak256(uint(unhashedAnswer).div(2).add(salt)) == round.hashedAnswers[msg.sender],
      "Hash doesn't match"
    );
  }

  function completeRequest(
    uint roundId
  ) internal {
    (address[] oraclesToGetExtraReward, bytes32 answer) = getAggregatedAnswer(roundId);
    distributeRewards(roundId, oraclesToGetExtraReward);
    cleanUpRequest();
    require(gasleft() >= minGasForCallback, "Not enough gas");
    (bool success, ) = rounds[roundId].callbackAddress.call( // solhint-disable-line avoid-low-level-calls
      abi.encodeWithSelector(
        rounds[roundId].callbackFunctionId,
        answer
      )
    );
    return success;
  }

  // TO REVIEW!!!
  function getAggregatedAnswer(
    uint roundId
  ) internal
  returns (
    address[] oraclesToGetExtraReward,
    bytes32 answer
  ) {
    OracleResponse[] oracleResponses =  rounds[roundId].oracleResponses;
    uint medianIndex = rounds[roundId].oracleResponses.length.div(2);
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

  // TO REVIEW!!!
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
    for (uint8 i = 0; i < rounds[roundIds[requestId]].requestIds; i++) {
      delete roundIds[rounds[roundIds[requestId]].requestIds[i]];
    }
    delete rounds[roundIds[requestId]];
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
}