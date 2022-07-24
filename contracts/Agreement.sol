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
  uint256 private state_; // 0 = PENDING, 1 = FULFILLED, 2 = CANCELLED, 3 = EXPIRED
  string public js;
  string public cid;
  string private ref;
  string[] private requiredPrivateVars;
  string[] private requiredPublicVars;
  mapping(address => bool) public cancellations;

  event Fulfilled(
    uint256 result
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
    require(state() == 0, "INACTIVE");
    require(msg.sender == ERC721(agreementRegistry).ownerOf(agreementId), "");
    if (bytes(ref).length > 0) {
      ref = _ref;
    }
    linkToken.transferFrom(msg.sender, address(this), REQUEST_COST);
    linkToken.approve(address(universalAdapter), REQUEST_COST);
    bytes32 requestId = universalAdapter.makeRequest(
      this.fulfillRequest.selector, js, cid, _vars, ref
    );
    return requestId;
  }

  function cancelAgreement() public {
    require(state() == 0, "INACTIVE");
    address sender = msg.sender;
    address _owner = owner;
    require(sender == _owner || sender == ERC721(agreementRegistry).ownerOf(agreementId), "UNAUTH");
    cancellations[sender] = true;
    if (cancellations[_owner] && cancellations[ERC721(agreementRegistry).ownerOf(agreementId)]) {
      state_ = 2;
    }
  }

  function recoverFunds() public {
    require(msg.sender == owner, "NOT_OWNER");
    require(state() != 0, "INACTIVE");
    linkToken.transfer(msg.sender, linkToken.balanceOf(address(this)));
  }

  function fulfillRequest(bytes32, bytes32 _result)
    public onlyUniversalAdapter
  {
    state_ = 1;
    if (uint256(_result) > linkToken.balanceOf(address(this))) {
      linkToken.transfer(ERC721(agreementRegistry).ownerOf(agreementId), linkToken.balanceOf(address(this)));
    } else {
      linkToken.transfer(ERC721(agreementRegistry).ownerOf(agreementId), uint256(_result));
      linkToken.transfer(owner, linkToken.balanceOf(address(this)));
    }
    emit Fulfilled(uint(_result));
  }

  function state() public view returns(uint256 _state) {
    _state = state_ == 1
      ? state_
      : block.timestamp > deadline // solhint-disable-line not-rely-on-time
        ? 3
        : state_;
  }

  modifier onlyUniversalAdapter {
    require(msg.sender == address(universalAdapter), "NOT_UA");
    _;
  }
}