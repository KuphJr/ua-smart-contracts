// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import "./interfaces/IUniversalAdapter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/ERC677ReceiverInterface.sol";

contract Agreement is Owned, ERC677ReceiverInterface {
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
  string public pubVars; // required public variables, separated by commas
  string public priVars; // required private variables, separated by commas

  event Received(address, uint);

  event Filled(uint256 result);

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
      priVars,
      pubVars,
      ref
    ) = abi.decode(data, (string, string, string, string, string));
  }

  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  // this is the 'redeem' function
  function onTokenTransfer( 
    address sender,
    uint amount,
    bytes calldata data
  ) external {
    require(state() == 0, "INACTIVE");
    require(msg.sender == address(linkToken), "NOT_LINK");
    require(amount == REQUEST_COST, "INCORRECT_AMOUNT");
    require(sender == ERC721(agreementRegistry).ownerOf(agreementId), "NOT_REDEEMER");
    string memory _vars;
    string memory _ref;
    (
      _vars,
      _ref
    ) = abi.decode(data, (string, string));
    if (bytes(_ref).length > 0) {
      ref = _ref;
    }
    linkToken.approve(address(universalAdapter), REQUEST_COST);
    universalAdapter.makeRequest(
      this.fulfillRequest.selector, js, cid, _vars, ref
    );
  }

  function cancelAgreement() public {
    require(state() == 0, "INACTIVE");
    require(msg.sender == ERC721(agreementRegistry).ownerOf(agreementId), "NOT_REDEEMER");
    state_ = 2;
    // transfer funds back to agreement creator
    payable(owner).transfer(address(this).balance);
  }

  function recoverFunds() public {
    require(state() != 0, "ACTIVE");
    payable(owner).transfer(address(this).balance);
  }

  function fulfillRequest(bytes32, bytes32 _result)
    public onlyUniversalAdapter
  {
    state_ = 1;
    if (uint256(_result) > address(this).balance) {
      payable(ERC721(agreementRegistry).ownerOf(agreementId)).transfer(address(this).balance);
    } else {
      payable(ERC721(agreementRegistry).ownerOf(agreementId)).transfer(uint256(_result));
      payable(owner).transfer(address(this).balance);
    }
    emit Filled(uint(_result));
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