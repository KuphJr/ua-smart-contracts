// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LinkTokenInterface} from "chainlink/interfaces/LinkTokenInterface.sol";
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
  uint256 public immutable requestCost;
  uint256 public immutable agreementId;
  address private immutable redeemer_;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  States private state_;
  string private js;
  string private cid;
  string[] public publicVars;
  string[] public privateVars;
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
    redeemer_ = _redeemer;
    deadline = _deadline;
    soulbound = _soulbound;
    state_ = States.PENDING;

    (
      js,
      cid,
      publicVars,
      privateVars,
      ref
    ) = abi.decode(data, (string, string, string[], string[], string));
  }

  function redeem( 
    string calldata _vars,
    string calldata _ref
  ) public override returns (bytes32 universalAdapterRequestId) {
    require(state() == States.PENDING, "INACTIVE_AGREEMENT");
    require(msg.sender == redeemer(), "INVALID_REDEEMER");

    // If the redeemer provides their own private vars, they can use them.
    // This prevents the contract owner from cancelling API keys and preventing
    // the redeemer from getting the money they are owed.
    if (bytes(ref).length > 0) {
      ref = _ref;
    }

    linkToken.transferFrom(msg.sender, address(this), requestCost);
    linkToken.approve(address(universalAdapter), requestCost);
    bytes32 requestId = universalAdapter.makeRequest(
      this.fulfillRequest.selector, js, cid, _vars, _ref
    );
    emit RequestSent(
      requestId, js, cid, _vars, _ref
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
    state_ = States.FULFILLED;
    result = uint256(_result);
    uint256 balance = linkToken.balanceOf(address(this));
    if (result > balance) {
      ERC20(address(linkToken)).safeTransfer(redeemer(), balance);
    } else {
      ERC20(address(linkToken)).safeTransfer(redeemer(), uint256(_result));
      ERC20(address(linkToken)).safeTransfer(owner, balance - uint256(_result));
    }

    emit RequestFulfilled(requestId, _result);
    emit AgreementFulfilled(agreementId);
  }

  function redeemer() public view returns(address _redeemer) {
    _redeemer = soulbound ? redeemer_ : ERC721(agreementRegistry).ownerOf(agreementId);
  }

  function state() public view returns(States _state) {
    _state = state_ == States.FULFILLED
      ? state_
      : block.timestamp > deadline // solhint-disable-line not-rely-on-time
        ? States.EXPIRED
        : state_;
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "Not Universal Adapter");
    _;
  }
}