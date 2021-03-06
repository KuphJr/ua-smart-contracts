// "SPDX-License-Identifier: MIT"
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;
import "hardhat/console.sol";

interface RequesterInterface {
  function getState() external view returns (bytes32 state);
}

contract OfferRegistry {

  struct Offer {
    address contractAddress;
    address offerer;
    address offeree;
    string scriptIpfsHash;
    uint maxOfferValue;
  }

  Offer[] public offers;

  address public owner;
  bytes32 public requesterContractHash;

  constructor(
    bytes32 _requesterContractHash
  ) {
    owner = msg.sender;
    requesterContractHash = _requesterContractHash;
  }

  function registerOffer (
    address offerer,
    address offeree,
    string calldata scriptIpfsHash,
    uint maxOfferValue
  ) external onlyRequester returns (uint offerIndex) {
    offers.push(
      Offer(msg.sender, offerer, offeree, scriptIpfsHash, maxOfferValue)
    );
    return offerIndex;
  }

  function getRegistryLength() public view returns (uint length) {
    return offers.length;
  }

  function getOfferContractAddress(
    uint offerIndex
  ) public view returns (address contractAddress) {
    return offers[offerIndex].contractAddress;
  }

  function getOfferOfferer(
    uint offerIndex
  ) public view returns (address offerer) {
    return offers[offerIndex].offerer;
  }

  function getOfferOfferee(
    uint offerIndex
  ) public view returns (address offeree) {
    return offers[offerIndex].offeree;
  }

  function getOfferScriptIpfsHash(
    uint offerIndex
  ) public view returns (string memory scriptIpfsHash) {
    return offers[offerIndex].scriptIpfsHash;
  }

  function getMaxOfferValue(
    uint offerIndex
  ) public view returns (uint maxOfferValue) {
    return offers[offerIndex].maxOfferValue;
  }

  function getOfferInfo(uint offerIndex) public view returns (Offer memory offer) {
    return offers[offerIndex];
  }

  function getOfferState(uint offerIndex) public view returns (bytes32 state) {
    return RequesterInterface(offers[offerIndex].contractAddress).getState();
  }

  //
  modifier onlyRequester {
    bytes32 contractHash;
    address requester = msg.sender;
    // solhint-disable-next-line no-inline-assembly
    assembly { contractHash := extcodehash(requester) }
    console.log("### Requester contract hash ###");
    console.logBytes32(contractHash);
    require(contractHash == requesterContractHash, "Invalid contract hash");
    _;
  }
}