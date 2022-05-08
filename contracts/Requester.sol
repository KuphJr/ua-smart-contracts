// "SPDX-License-Identifier: MIT"
pragma solidity >=0.7.0;

import "@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol";

interface DirectRequestAggregatorInterface {
  function makeRequest(
    string calldata js,
    string calldata cid,
    string calldata vars,
    bytes32 ref,
    bytes32 returnType
  ) external;
}

interface OfferRegistryInterface {
  function registerOffer(
    address requester,
    string calldata scriptIpfsHash,
    uint256 maxOfferValue
  ) external;
}

contract Requester {
  /*
   * The 3 variables below will not change between contract instances,
   * unless the contract is deployed to a different blockchain.
   */ 
  LinkTokenInterface public linkTokenContract;
  DirectRequestAggregatorInterface public aggregatorContract;
  OfferRegistryInterface public registryContract;

  /*
   * The 3 variables below will be set when this contract is deployed and initalized.
   */
  address public offerer;
  address public offeree;
  string public scriptIpfsHash;
  uint public expirationTime;
  
  /*
   * The variable below is used to prevent multiple concurrent Universal Adapter direct requests.
   */
  uint public lastBlockFulfillOfferWasCalled;

  /**
   * @dev A brand deploys a separate instance of this contract for each individual sponsorship
   * deal they want to offer an influencer.
   * @param _link The address of the LINK token contract
   * @param _aggregator The address of the aggregator contract for Universal Adapter direct requests
   * @param _registry The address of the registry contract
   * @param _offeree The address of the influencer who is being offered the contract
   * @param _scriptIpfsHash The content identifer for the JavaScript code that has been uploaded
   * to IPFS. This code contains the logic which determines how much an influcer is paid.
   * @param _expirationTime The time (in seconds since the UNIX epoch) at which the contract ends
   * and the `fulfillOffer` function can no longer be called.
  */
  constructor (
    address _link,
    address _aggregator,
    address _registry,
    address _offeree,
    string memory _scriptIpfsHash,
    uint _expirationTime
  ) {
    linkTokenContract = LinkTokenInterface(_link);
    aggregatorContract = DirectRequestAggregatorInterface(_aggregator);
    registryContract = OfferRegistryInterface(_registry);
    offerer = msg.sender;
    offeree = _offeree;
    scriptIpfsHash = _scriptIpfsHash;
    expirationTime = _expirationTime;
  }

  /**
   * @dev This function is called by a brand to add LINK to the contract to pay an influencer and
   * fund the Universal Adapter direct request.  It also registers with the registry contract.
   * @notice This function must be called AFTER the brand approves an allowance for this contract
   * that has a value equal to the maximum value an influencer can earn + 1 LINK.
   * The additional 1 LINK is used to pay for the Universal Adapter direct request.
   */
  function initalizeOffer() public onlyOfferer {
    // The brand must fund the contract with more than 1 LINK in order to pay for the
    // direct request and have funds left to pay the influencer.
    uint balance = linkTokenContract.allowance(offerer, address(this));
    require(
      balance > 1000000000000000000,
      "Fund with > 1 LINK"
    );
    linkTokenContract.transferFrom(offerer, address(this), balance);
    registryContract.registerOffer(
      offerer, scriptIpfsHash,
      linkTokenContract.allowance(offerer, address(this)) - 1000000000000000000
    );
  }

  /**
    @dev This function is called by the influencer to fulfill a brand integration offer and
    initiate the Universal Adapter direct request to calculate and send the amount earned.
    @param url The URL of the sponsored Tweet
    @param apiKey A functioning Twitter API key
  */
  function fulfillOffer(
    string calldata url,
    string calldata apiKey
  ) public onlyOfferee {
    require(block.timestamp <= expirationTime, "Offer expired");
    // This logic allows a "retry" to fulfill the offer.
    // If the direct request isn't fulfilled within 128 blocks, it has failed and will never be
    // fulfilled. This logic is handled in the DirectRequestAggregator contract.
    require(block.number - lastBlockFulfillOfferWasCalled > 128, "Still waiting for response");
    lastBlockFulfillOfferWasCalled = block.number;
    // the `vars` object must be a JSON formatted string
    string memory vars = string(abi.encodePacked('{"tweetUrl":"', url, '","apiKey":"', apiKey, '"}'));
    linkTokenContract.transferFrom(address(this), address(aggregatorContract), 1000000000000000000);
    aggregatorContract.makeRequest("", scriptIpfsHash, vars, "", "uint");
  }

  /**
    @dev This function is called by the direct request aggregator contract to fulfill the request
    to send the tokens owed to the influencer and send the remaining balance back to the brand
  */
  function fulfillDirectRequest(
    uint amountOwed
  ) public onlyDON {
    uint balance = linkTokenContract.balanceOf(address(this));
    if (balance <= amountOwed) {
      linkTokenContract.transferFrom(address(this), offeree, balance);
      return;
    }
    linkTokenContract.transferFrom(address(this), offeree, amountOwed);
    linkTokenContract.transferFrom(
      address(this),
      offerer,
      linkTokenContract.balanceOf(address(this))
    );
  }

  /**
    @dev If the offer has not been fulfilled before the expiration time,
    the brand can recover their locked funds.
  */
  function recoverFunds() public {
    require(block.timestamp > expirationTime, "Offer not expired");
    linkTokenContract.transferFrom(
      address(this),
      offerer,
      linkTokenContract.balanceOf(address(this))
    );
  }

  modifier onlyOfferer {
    require(msg.sender == offerer, "Only offerer");
    _;
  }

  modifier onlyOfferee {
    require(msg.sender == offeree, "Only offeree");
    _;
  }

  /**
   * @dev A modifier that only allows a function to be called by the direct request
   * aggregator contract.
   */
  modifier onlyDON {
    require(msg.sender == address(aggregatorContract), "Only DON");
    _;
  }
}