// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Owned} from "@solmate/auth/Owned.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {ERC721} from "@solmate/tokens/ERC721.sol";
import {SafeTransferLib} from "@solmate/utils/SafeTransferLib.sol";
import "./interfaces/IAgreement.sol";
import "./interfaces/IUniversalAdapter.sol";

contract Agreement is IAgreement, Owned {
  using SafeTransferLib for ERC20;
  
  LinkTokenInterface private immutable linkToken;
  IUniversalAdapter private immutable universalAdapter;
  address private immutable agreementRegistry;
  uint256 private immutable requestCost;
  uint256 public immutable agreementId;
  address private immutable redeemer_;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  States private state_;
  string private js;
  string private cid;
  string private vars;
  string private ref;
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

  bytes32 public result;

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
    string memory _js,
    string memory _cid,
    string memory _vars,
    string memory _ref
  ) Owned(_creator) {
    linkToken = _link;
    universalAdapter = _universalAdapter;
    agreementRegistry = _agreementRegistry;
    requestCost = _requestCost;
    agreementId = _agreementId;
    redeemer_ = _redeemer;
    deadline = _deadline;
    soulbound = _soulbound;
    state_ = States.PENDING;
    js = _js;
    cid = _cid;
    vars = _vars;
    ref = _ref;
  }

  function makeRequest(
    /* TODO: url etc & private vars packed with public vars? */
  ) public override returns (bytes32 universalAdapterRequestId) {
    require(state() == States.PENDING, "INACTIVE_AGREEMENT");
    require(msg.sender == redeemer(), "INVALID_REDEEMER");

    linkToken.transferFrom(msg.sender, address(this), requestCost);
    linkToken.approve(address(universalAdapter), requestCost);
    bytes32 requestId = universalAdapter.makeRequest(
      js, cid, vars, ref
    );
    emit RequestSent(
      requestId, js, cid, vars, ref
    );
    return requestId;
  }

  function cancelAgreement() public {
    require(state() == States.PENDING, "CANNOT_CANCEL");
    address sender = msg.sender;
    address _owner = owner;
    address _redeemer = redeemer();
    require(sender == _owner || sender == _redeemer, "NOT_ALLOWED");
    cancellations[sender] = true;
    if (cancellations[_owner] && cancellations[_redeemer]) {
      state_ = States.CANCELLED;
      emit AgreementCancelled(agreementId);
    }
  }

  function recoverFunds() public {
    require(msg.sender == owner, "ONLY_OWNER");
    require(state() != States.PENDING, "STILL_PENDING");
    ERC20(address(linkToken)).safeTransfer(msg.sender, linkToken.balanceOf(address(this)));
  }

  function fulfillRequest(bytes32 requestId, bytes32 _result)
    public override onlyUniversalAdapter
  {
    result = _result;

    // TODO some condition on bytes32 result? Do we need to map anything against requestId?
    // state_ = States.FULFILLED;
    // ERC20(address(linkToken)).safeTransfer(redeemer(), juels);

    emit RequestFulfilled(requestId, _result);
    emit AgreementFulfilled(agreementId);
  }

  function redeemer() public view returns(address _redeemer) {
    _redeemer = soulbound ? redeemer_ : ERC721(agreementRegistry).ownerOf(agreementId);
  }

  function state() public view returns(States _state) {
    _state = state_ == States.FULFILLED
      ? state_
      : block.timestamp >= deadline
        ? States.EXPIRED
        : state_;
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "Not Universal Adapter");
    _;
  }
}