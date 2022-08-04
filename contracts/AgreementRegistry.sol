// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/ERC677ReceiverInterface.sol";
import {Strings} from "./utils/Strings.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";

contract AgreementRegistry is Owned, ERC721, ERC677ReceiverInterface {
  using Strings for address;
  using Strings for string;
  using Strings for uint256;

  LinkTokenInterface private linkToken;
  IUniversalAdapter private universalAdapter;
  
  uint256 public ids;
  mapping(address => uint256) private nonces;

  Agreement[] public agreements;
  mapping(address => uint[]) private creatorAgreements;
  mapping(address => uint[]) private redeemerAgreements;

  event Created(address owner, uint256 id);

  constructor(
    LinkTokenInterface _linkToken,
    IUniversalAdapter _universalAdapter
  ) ERC721("Universal Adapter Protocol", "uApp") Owned(msg.sender) {
    linkToken = _linkToken;
    universalAdapter = _universalAdapter;
  }


  // This is the 'create' function.  It is triggered using transferAndCall() from the LINK token
  function onTokenTransfer( // solhint-disable payable-fallback, no-complex-fallback
    address sender,
    uint256 value,
    bytes calldata data
  ) external {
    address redeemer;
    uint256 deadline;
    bool soulbound;
    uint256 maxPayout;
    bytes memory agreementData;
    (
      redeemer,
      deadline,
      soulbound,
      maxPayout,
      agreementData
    ) = abi.decode(data, (address, uint256, bool, uint256, bytes));
    require(msg.sender == address(linkToken), "NOT_LINK");
    require(redeemer != address(0), "INVALID_ADDRESS");
    require(value == maxPayout, "WRONG_AMOUNT");
    // solhint-disable-next-line not-rely-on-time
    require(deadline > block.timestamp, "INVALID_DEADLINE");
    uint256 agreementId = ids++;
    // Use the CREATE2 opcode to deploy a new Agreement contract.
    // Unchecked as creator nonce cannot realistically overflow.
    bytes32 salt;
    unchecked {
      salt = keccak256(abi.encodePacked(
          sender,
          nonces[sender]++
        ));
    }
    createAgreement(
      sender,
      salt,
      agreementId,
      redeemer,
      deadline,
      soulbound,
      maxPayout,
      agreementData
    );
  }

  function createAgreement(
    address sender,
    bytes32 salt,
    uint256 agreementId,
    address redeemer,
    uint256 deadline,
    bool soulbound,
    uint256 maxPayout,
    bytes memory agreementData
  ) internal {
    Agreement agreement = new Agreement{salt: salt}(
      linkToken,
      universalAdapter,
      address(this),
      agreementId,
      sender,
      deadline,
      soulbound,
      agreementData
    );
    linkToken.transfer(address(agreement), maxPayout);
    agreements.push(agreement);
    creatorAgreements[sender].push(agreementId);
    redeemerAgreements[redeemer].push(agreementId);

    _safeMint(redeemer, agreementId);

    emit Created(sender, agreementId);
}

// gets the ids for all the agreements that have been created by the specified creator
function getCreatorAgreements(address creator) public view returns(uint[] memory) {
  return (creatorAgreements[creator]);
}

// gets the ids for all the agreements that can be redeemed for the specified redeemer
function getRedeemerAgreements(address redeemer) public view returns(uint[] memory) {
  return (redeemerAgreements[redeemer]);
}

// In order to read in JSON format, append { to the beginning and "} to the end of the URI string.
function tokenURI(uint256 id) public view override returns (string memory uri) {
  require(_ownerOf[id] != address(0), "INVALID_ID");
  Agreement agreement = agreements[id];
  // solhint-disable quotes
  uri = string(abi.encodePacked(
    '"address":"', address(agreement).toString(),
    '","agreementCode":"', bytes(agreement.cid()).length > 0 ? agreement.cid() : agreement.js(),
    '","balance":"', linkToken.balanceOf(address(agreement)).toString(),
    '","creator":"', agreement.owner().toString(),
    '","redeemer":"', _ownerOf[id].toString(),
    '","soulbound":"', agreement.soulbound() ? "true" : "false",
    '","state":"', agreement.state().toString(),
    '","deadline":"', agreement.deadline().toString()
  ));
  // solhint-enable quotes
}


  // Even soulbound agreements can be burned
  function burn(uint256 id) public {
    Agreement agreement = agreements[id];
    if (agreement.state() == 0) {
      agreement.cancelAgreement(); 
    }
    _burn(id);
  }

  // if soulbound, the following actions are not permitted by the redeemer (ie: NFT owner)
  function transferFrom(
      address from,
      address to,
      uint256 id
  ) public override {
      require(!agreements[id].soulbound(), "SOULBOUND");
      super.transferFrom(from, to, id);
  }

  function approve(
      address to,
      uint256 id
  ) public override {
      require(!agreements[id].soulbound(), "SOULBOUND");
      super.approve(to, id);
  }

  function setApprovalForAll(address operator, bool approved) public override { // solhint-disable no-unused-vars
    require(false, "NOT_ALLOWED");
  }
}