// "SPDX-License-Identifier: MIT"
pragma solidity >=0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "hardhat/console.sol";

interface UniversalAdapterInterface {
  function makeRequest(
    bytes4 callbackFunctionId,
    string calldata js,
    string calldata cid,
    string calldata vars,
    string calldata ref
  ) external returns (bytes32 requestId);
}

contract Requester {
  LinkTokenInterface private linkToken;
  UniversalAdapterInterface private universalAdapter;

  event RequestSent(
    bytes4 callbackFunctionId,
    string js,
    string cid,
    string vars,
    string ref  
  );

  event RequestFulfilled(
    bytes32 result,
    bytes32 requestId
  );

  bytes32 public result;
  uint private requestCost;

  constructor (
    address _link,
    address _universalAdapter,
    uint _requestCost
  ) {
    linkToken = LinkTokenInterface(_link);
    universalAdapter = UniversalAdapterInterface(_universalAdapter);
    requestCost = _requestCost;
  }

  function makeRequest(
    string calldata js,
    string calldata cid,
    string calldata vars,
    string calldata ref
  ) public returns (bytes32 universalAdapterRequestId) {
    linkToken.transferFrom(msg.sender, address(this), requestCost);
    linkToken.approve(address(universalAdapter), requestCost);
    bytes32 requestId = universalAdapter.makeRequest(
      this.fulfillDirectRequest.selector,
      js, cid, vars, ref
    );
    emit RequestSent(
      this.fulfillDirectRequest.selector, js, cid, vars, ref
    );
    return requestId;
  }

  function fulfillDirectRequest(bytes32 requestId, bytes32 _result)
  public onlyUniversalAdapter {
    result = _result;
    emit RequestFulfilled(_result, requestId);
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "Not Universal Adapter");
    _;
  }
}