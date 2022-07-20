// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import "./interfaces/IAgreement.sol";
import "./interfaces/IUniversalAdapter.sol";

contract Agreement is IAgreement, Owned {
  LinkTokenInterface private immutable linkToken;
  IUniversalAdapter private immutable universalAdapter;
  address private immutable agreementRegistry;
  uint256 private immutable requestCost;
  uint256 public immutable agreementId;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  address private redeemer;
  States private state_;
  string private js;
  string private cid;
  string private vars;
  string private ref;
  uint256 public result;
  mapping(address => bool) public cancellations;

  enum States {
    PENDING,
    FULFILLED,
    CANCELLED,
    EXPIRED
  }

  event AgreementFulfilled(
    uint256 indexed agreementId
  );

  event AgreementCancelled(
    uint256 indexed agreementId
  );

  event RequestSent(
    bytes32 indexed requestId,
    string js,
    string cid,
    string vars,
    string ref
  );

  event RequestFulfilled(
    bytes32 indexed requestId,
    bytes32 result
  );

  constructor (
    LinkTokenInterface _link,
    IUniversalAdapter _universalAdapter,
    address _agreementRegistry,
    uint256 _requestCost,
    uint256 _agreementId,
    address _creator,
    address _redeemer,
    uint256 _deadline,
    bool _soulbound,
    bytes memory data
  ) Owned(_creator) {
    linkToken = _link;
    universalAdapter = _universalAdapter;
    agreementRegistry = _agreementRegistry;
    requestCost = _requestCost;
    agreementId = _agreementId;
    redeemer = _redeemer;
    deadline = _deadline;
    soulbound = _soulbound;
    state_ = States.PENDING;
    (
      js,
      cid,
      vars,
      ref
    ) = abi.decode(data, (string, string, string, string));
  }

  function makeRequest( 
    string calldata _vars
  ) public override returns (bytes32 universalAdapterRequestId) {
    require(state() == States.PENDING, "INACTIVE_AGREEMENT");
    require(msg.sender == redeemer, "INVALID_REDEEMER");

    linkToken.transferFrom(msg.sender, address(this), requestCost);
    linkToken.approve(address(universalAdapter), requestCost);
    bytes32 requestId = universalAdapter.makeRequest(
      this.fulfillRequest.selector, js, cid, _vars, ref
    );
    emit RequestSent(
      requestId, js, cid, _vars, ref
    );
    return requestId;
  }

  function cancelAgreement() public {
    require(state() == States.PENDING, "CANNOT_CANCEL");
    address sender = msg.sender;
    address _owner = owner;
    require(sender == _owner || sender == redeemer, "NOT_ALLOWED");
    cancellations[sender] = true;
    if (cancellations[_owner] && cancellations[redeemer]) {
      state_ = States.CANCELLED;
      emit AgreementCancelled(agreementId);
    }
  }

  function recoverFunds() public {
    require(msg.sender == owner, "ONLY_OWNER");
    require(state() != States.PENDING, "STILL_PENDING");
    linkToken.transfer(msg.sender, linkToken.balanceOf(address(this)));
  }

  function fulfillRequest(bytes32 requestId, bytes32 _result)
    public override onlyUniversalAdapter
  {
    state_ = States.FULFILLED;
    result = uint256(_result);
    linkToken.transfer(redeemer, uint256(_result));
    // We should automatically transfer the remaining value in the contract back to the contract creator.  They should not have to call recoverFunds()
    linkToken.transfer(msg.sender, linkToken.balanceOf(address(this)));
    emit RequestFulfilled(requestId, _result);
    emit AgreementFulfilled(agreementId);
  }

  function state() public view returns(States _state) {
    _state = state_ == States.FULFILLED
      ? state_
      // this is super minor, but I think that a contract isn't expired until AFTER the expiration date, not including the expiration date
      : block.timestamp > deadline // solhint-disable-line not-rely-on-time
        ? States.EXPIRED
        : state_;
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "Not Universal Adapter");
    _;
  }
}