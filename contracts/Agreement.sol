// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import "./interfaces/IAgreement.sol";
import "./interfaces/IUniversalAdapter.sol";

contract Agreement is IAgreement, Owned {
  uint256 private constant REQUEST_COST = 100;

  LinkTokenInterface private immutable linkToken;
  IUniversalAdapter private immutable universalAdapter;
  address private immutable agreementRegistry;
  uint256 public immutable agreementId;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  address private redeemer_;
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
    address _agreementRegistry,
    uint256 _agreementId,
    address _creator,
    address _redeemer,
    uint256 _deadline,
    bool _soulbound,
    bytes memory data
  ) Owned(_creator) {
    linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    universalAdapter = IUniversalAdapter(0x5526B90295EcAbB23E4ce210511071843C8EE955);
    agreementRegistry = _agreementRegistry;
    agreementId = _agreementId;
    // we don't need to pass the redeemer if we abstract away that logic to the NFT contract
    redeemer_ = _redeemer;
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
  ) public override returns (bytes32 universalAdapterRequestId) {
    require(state() == States.PENDING, "INACTIVE_AGREEMENT");
    require(msg.sender == redeemer(), "INVALID_REDEEMER");
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
    require(state() == States.PENDING, "CANNOT_CANCEL");
    address sender = msg.sender;
    address _owner = owner;
    require(sender == _owner || sender == redeemer(), "NOT_ALLOWED");
    cancellations[sender] = true;
    if (cancellations[_owner] && cancellations[redeemer()]) {
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
    linkToken.transfer(redeemer(), uint256(_result));
    // We should automatically transfer the remaining value in the contract back to the contract creator.  They should not have to call recoverFunds()
    linkToken.transfer(msg.sender, linkToken.balanceOf(address(this)));
    emit RequestFulfilled(requestId, _result);
    emit AgreementFulfilled(agreementId);
  }

  function redeemer() public view returns(address _redeemer) {
    _redeemer = soulbound ? redeemer_ : ERC721(agreementRegistry).ownerOf(agreementId);
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