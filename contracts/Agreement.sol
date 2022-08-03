// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.4/interfaces/ERC677Receiver.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import "./interfaces/IUniversalAdapter.sol";

contract Agreement is Owned, ERC677Receiver {
  uint256 private constant REQUEST_COST = 100;
  using IUniversalAdapter for IUniversalAdapter.PublicVars;
  using IUniversalAdapter for IUniversalAdapter.EncryptedPrivateVars;

  struct ConfigVars {
    string[] keys;
    string[] values;
  }

  LinkTokenInterface private immutable linkToken;
  IUniversalAdapter private immutable universalAdapter;
  address private immutable agreementRegistry;
  uint256 public immutable agreementId;
  uint256 public immutable deadline;
  bool public immutable soulbound;
  uint256 private state_; // 0 = PENDING, 1 = FULFILLED, 2 = CANCELLED, 3 = EXPIRED

  /* URLs to fetch contract source code.
  * Multiple can sources specified as a fallback if the prior source fails to provide
  * source code matching the checksum. Use a newline in between each source.
  * To use IPFS, use ipfs://IPFS_CID_HERE/fileToUse.js instead of http://WEBSITE.com/fileToUse.js
  * ex:
  *   ipfs://bafybeiacrc4jvhc7wphhsmwzue6ffviays2kyhzqa2k2ypw6l7adaff5fe/fileToUse.js
  *   https://github.com/KuphJr/ExampleRepo/fileToUse.js
  *   http://myWebsite.com/fileToUse.js
  *
  * This relies on decentralized storage first, but if it fails because the file is not pinned
  * or another error, code will be pulled from centralized infrastructure & validated via checksum
  */
  string public immutable source;
  // SHA256 hash of the JavaScript source code
  bytes32 public immutable checksum;
  ConfigVars[] public configVars;
  string public requiredPubVars; // required public variables, separated by commas
  string public requiredPriVars; // required private variables, separated by commas
  mapping(address => bool) public cancellations;

  event Filled(
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
    soulbound = _soulbound;
    deadline = _deadline;
    (
      source,
      checksum,
      configVars,
      requiredPriVars,
      requiredPubVars
    ) = abi.decode(data, (string, bytes32, ConfigVars, string, string));
  }

  // This is the 'redeem' function.  It is triggered by transferring LINK tokens.
  function onTokenTransfer(
    address sender,
    uint256 value,
    bytes calldata data
  ) external returns (bytes memory universalAdapterRequestId) {
    require(msg.sender == address(linkToken), "NOT_LINK");
    require(value == REQUEST_COST, "WRONG_AMOUNT");
    require(state() == 0, "INACTIVE");
    require(sender == ERC721(agreementRegistry).ownerOf(agreementId), "ONLY_REDEEMER");
    IUniversalAdapter.PublicVars publicVars;
    IUniversalAdapter.EncryptedPrivateVars privateVars;
    // TODO copy pub vars
    for (uint i = 0; i < publicVars[i])
    (
      source,
      checksum,
      publicVars,
      privateVars
    ) = abi.decode(data, string, bytes32, PublicVars, PrivateVars);
    bytes32 requestId = universalAdapter.makeRequest(
      this.fulfillRequest.selector, source, checksum, publicVars, privateVars
    );
    return requestId;
  }

  function cancelAgreement() public {
    require(state() == 0, "INACTIVE");
    require(msg.sender == ERC721(agreementRegistry).ownerOf(agreementId), "ONLY_REDEEMER");
    state_ = 2;
    linkToken.transfer(owner, linkToken.balanceOf(address(this)));
  }

  function recoverFunds() public {
    require(msg.sender == owner, "NOT_OWNER");
    require(state() != 0, "ACTIVE");
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