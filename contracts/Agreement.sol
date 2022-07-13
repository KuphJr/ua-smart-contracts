// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "./interfaces/IAgreement.sol";
import "./interfaces/IUniversalAdapter.sol";

contract Agreement is IAgreement{
  LinkTokenInterface private immutable linkToken;
  IUniversalAdapter private immutable universalAdapter;
  uint256 private immutable requestCost;
  uint256 public immutable agreementId;
  address public immutable redeemer;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  string private js;
  string private cid;
  string private vars;
  string private ref;

  event RequestSent(
    string js,
    string cid,
    string vars,
    string ref,
    bytes32 requestId
  );

  event RequestFulfilled(
    bytes32 result,
    bytes32 requestId
  );

  bytes32 public result;

  constructor (
    LinkTokenInterface _link,
    IUniversalAdapter _universalAdapter,
    uint256 _requestCost,
    uint256 _agreementId,
    address _redeemer,
    uint256 _deadline,
    bool _soulbound,
    string memory _js,
    string memory _cid,
    string memory _vars,
    string memory _ref
  ) {
    // TODO: is there any benefit to having this contract ownable?
    linkToken = _link;
    universalAdapter = _universalAdapter;
    requestCost = _requestCost;
    agreementId = _agreementId;
    redeemer = _redeemer;
    deadline = _deadline;
    soulbound = _soulbound;
    js = _js;
    cid = _cid;
    vars = _vars;
    ref = _ref;
  }

  function makeRequest(
    /* TODO: url etc */
  ) public override returns (bytes32 universalAdapterRequestId) {
    // TODO: require only redeemer, or ownerOf agreementId if not soulbound

    linkToken.transferFrom(msg.sender, address(this), requestCost);
    linkToken.approve(address(universalAdapter), requestCost);
    bytes32 requestId = universalAdapter.makeRequest(
      js, cid, vars, ref
    );
    emit RequestSent(
      js, cid, vars, ref, requestId
    );
    return requestId;
  }

  function fulfillRequest(bytes32 requestId, bytes32 _result)
    public override onlyUniversalAdapter
  {
    result = _result;
    emit RequestFulfilled(_result, requestId);
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "Not Universal Adapter");
    _;
  }
}