// "SPDX-License-Identifier: MIT"
pragma solidity >=0.7.0;
pragma experimental ABIEncoderV2;

contract OfferRegistry {

  struct Offer {
    address offerContractAddress;
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
  ) external onlyRequester {
    offers.push(
      Offer(msg.sender, offerer, offeree, scriptIpfsHash, maxOfferValue)
    );
  }

  function getRegistryLength() public view returns (uint length) {
    return offers.length;
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

  //
  modifier onlyRequester {
    bytes32 codeHash;
    address requester = msg.sender;
    assembly { codeHash := extcodehash(requester) }
    require(codeHash == requesterContractHash, "Invalid contract hash");
    _;
  }
}