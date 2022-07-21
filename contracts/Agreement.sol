// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import "./interfaces/IUniversalAdapter.sol";

contract Agreement is Owned {
  uint256 private constant REQUEST_COST = 100;

  LinkTokenInterface private immutable linkToken;
  IUniversalAdapter private immutable universalAdapter;
  address private immutable agreementRegistry;
  uint256 public immutable agreementId;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  States private state_;
  string private js;
  string private cid;
  string[] private requiredPrivateVars;
  string[] private requiredPublicVars;
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
    LinkTokenInterface _linkToken,
    IUniversalAdapter _universalAdapter,
    address _agreementRegistry,
    uint256 _agreementId,
    address _creator,
    uint256 _deadline,
    bool _soulbound,
    bytes memory data
  ) Owned(_creator) {
    linkToken = _linkToken;
    universalAdapter = _universalAdapter;
    agreementRegistry = _agreementRegistry;
    agreementId = _agreementId;
    deadline = _deadline;
    soulbound = _soulbound;
    state_ = States.PENDING;
    (
      js,
      cid,
      requiredPublicVars,
      requiredPrivateVars,
      ref
    ) = abi.decode(data, (string, string, string[], string[], string));
  }

  function redeem( 
    string calldata _vars,
    string calldata _ref
  ) public returns (bytes32 universalAdapterRequestId) {
    require(state() == States.PENDING, "INACTIVE");
    require(msg.sender == ERC721(agreementRegistry).ownerOf(agreementId), "REDEEMER");
    // If the redeemer provides their own private vars, they can use them.
    // This prevents the contract owner from cancelling API keys and preventing
    // the redeemer from getting the money they are owed.
    if (bytes(ref).length > 0) {
      ref = _ref;
    }
    linkToken.transferFrom(msg.sender, address(this), REQUEST_COST);
    linkToken.approve(address(universalAdapter), REQUEST_COST);
    bytes32 requestId = universalAdapter.makeRequest(
      this.fulfillRequest.selector, js, cid, _vars, ref
    );
    emit RequestSent(
      requestId, js, cid, _vars, ref
    );
    return requestId;
  }

  function cancelAgreement() public {
    require(state() == States.PENDING, "CANT_CANCEL");
    address sender = msg.sender;
    address _owner = owner;
    require(sender == _owner || sender == ERC721(agreementRegistry).ownerOf(agreementId), "NOT_ALLOWED");
    cancellations[sender] = true;
    if (cancellations[_owner] && cancellations[ERC721(agreementRegistry).ownerOf(agreementId)]) {
      state_ = States.CANCELLED;
      emit AgreementCancelled(agreementId);
    }
  }

  function recoverFunds() public {
    require(msg.sender == owner, "NOT_OWNER");
    require(state() != States.PENDING, "PENDING");
    linkToken.transfer(msg.sender, linkToken.balanceOf(address(this)));
  }

  function fulfillRequest(bytes32 requestId, bytes32 _result)
    public onlyUniversalAdapter
  {
    state_ = States.FULFILLED;
    result = uint256(_result);
    if (result > linkToken.balanceOf(address(this))) {
      linkToken.transfer(ERC721(agreementRegistry).ownerOf(agreementId), linkToken.balanceOf(address(this)));
    } else {
      linkToken.transfer(ERC721(agreementRegistry).ownerOf(agreementId), uint256(_result));
      linkToken.transfer(owner, linkToken.balanceOf(address(this)));
    }
    emit RequestFulfilled(requestId, _result);
    emit AgreementFulfilled(agreementId);
  }

  function state() public view returns(States _state) {
    _state = state_ == States.FULFILLED
      ? state_
      : block.timestamp > deadline // solhint-disable-line not-rely-on-time
        ? States.EXPIRED
        : state_;
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "NOT_UA");
    _;
  }
}