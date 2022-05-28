// "SPDX-License-Identifier: MIT"
pragma solidity >=0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

interface DirectRequestAggregatorInterface {
  function makeRequest(
    address callbackAddress, bytes4 callbackFunctionId,
    string calldata js, string calldata cid,
    string calldata vars, bytes32 ref
  ) external returns (uint roundId);
}

contract ExampleRequester {
  LinkTokenInterface public linkTokenContract;
  DirectRequestAggregatorInterface public aggregatorContract;

  event RequestSent(
    address callbackAddress,
    bytes4 callbackFunctionId,
    string js,
    string cid,
    string vars,
    bytes32 ref  
  );

  event RequestFulfilled(
    bytes32 result,
    uint requestNumber
  );

  bytes32 public result;
  uint private requestCost;

  constructor (address _link, address _aggregator, uint _requestCost) {
    linkTokenContract = LinkTokenInterface(_link);
    aggregatorContract = DirectRequestAggregatorInterface(_aggregator);
    requestCost = _requestCost;
  }

  function makeRequest(
    string calldata js, string calldata cid, string memory vars, bytes32 ref
  ) public returns (uint requestNumber) {
    linkTokenContract.transferFrom(msg.sender, address(this), 100);
    linkTokenContract.approve(address(aggregatorContract), 100);
    uint requestNum = aggregatorContract.makeRequest(
      address(this),
      this.fulfillDirectRequest.selector,
      js, cid, vars, ref
    );
    emit RequestSent(
      address(this), this.fulfillDirectRequest.selector, js, cid, vars, ref
    );
    return requestNum;
  }

  function fulfillDirectRequest(uint _requestNumber, bytes32 _result)
  public onlyDirectRequestAggregator {
    result = _result;
    emit RequestFulfilled(_result, _requestNumber);
  }

  modifier onlyDirectRequestAggregator {
    require(msg.sender == address(aggregatorContract), "Not aggregator");
    _;
  }
}