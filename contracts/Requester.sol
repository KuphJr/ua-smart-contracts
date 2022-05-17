// "SPDX-License-Identifier: MIT"
pragma solidity >=0.7.0;

import "@chainlink/contracts/src/v0.7/interfaces/LinkTokenInterface.sol";

interface DirectRequestAggregatorInterface {
  function makeRequest(
    address callbackAddress,
    bytes4 callbackFunctionId,
    string calldata js,
    string calldata cid,
    string calldata vars,
    bytes32 ref
  ) external;
}

interface OfferRegistryInterface {
  function registerOffer(
    address offerer,
    address offeree,
    string calldata scriptIpfsHash,
    uint maxOfferValue
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

  // The 3 variables below will be set when this contract is deployed and initalized.
  address public offerer;
  address public offeree;
  string public scriptIpfsHash;
  uint public expirationTime;

  // Holds the state of the contract.  Either "pending", "fulfilled" or "expired"
  bytes32 public state;

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
   * @dev This function is called by a brand to add LINK to the contract to pay an influencer.
   * It also registers with the registry contract.
   */
  function initalizeOffer() public onlyOfferer {
    uint balance = linkTokenContract.allowance(offerer, address(this));
    linkTokenContract.transferFrom(offerer, address(this), balance);
    registryContract.registerOffer(
      offerer,
      offeree,
      scriptIpfsHash,
      balance
    );
  }

  /**
    @dev This function is called by the influencer to fulfill a brand integration offer and
    initiate the Universal Adapter direct request to calculate and send the amount earned.
    @notice This function must be called AFTER the influencer approves 1 LINK to be spend
    * by this contract in order to pay for the request.
    @param url The URL of the sponsored Tweet
    @param apiKey A functioning Twitter API key
  */
  function fulfillOffer(
    string calldata url,
    string calldata apiKey
  ) public onlyOfferee {
    require(
      linkTokenContract.allowance(msg.sender, address(this)) >= 1000000000000000000,
      "Must approve 1 LINK"
    );
    // solhint-disable-next-line not-rely-on-time
    require(block.timestamp <= expirationTime, "Offer expired");
    // the `vars` object must be a JSON formatted string
    string memory vars = string(abi.encodePacked('{"tweetUrl":"', url, '","apiKey":"', apiKey, '"}')); // solhint-disable-line
    linkTokenContract.transferFrom(
      msg.sender,
      address(this),
      1000000000000000000
    );
    linkTokenContract.approve(
      address(aggregatorContract),
      1000000000000000000
    );
    aggregatorContract.makeRequest(
      address(this),
      this.fulfillDirectRequest.selector,
      "",
      scriptIpfsHash,
      vars,
      ""
    );
  }

  /**
    @dev This function is called by the direct request aggregator contract to fulfill the request
    to send the tokens owed to the influencer and send the remaining balance back to the brand
  */
  function fulfillDirectRequest(
    bytes32 requestId,
    uint amountOwed
  ) public onlyDirectRequestAggregator returns (bytes32 requestId) {
    uint balance = linkTokenContract.balanceOf(address(this));
    if (balance <= amountOwed) {
      linkTokenContract.transferFrom(
        address(this),
        offeree,
        balance
      );
      return;
    }
    linkTokenContract.transferFrom(
      address(this),
      offeree,
      amountOwed
    );
    linkTokenContract.transferFrom(
      address(this),
      offerer,
      linkTokenContract.balanceOf(address(this))
    );
    state = "fulfilled";
    return requestId;
  }

  /**
    @dev If the offer has not been fulfilled before the expiration time,
    the brand can recover their locked funds.
  */
  function recoverFunds() public {
    // solhint-disable-next-line not-rely-on-time
    require(block.timestamp > expirationTime, "Offer not expired");
    linkTokenContract.transferFrom(
      address(this),
      offerer,
      linkTokenContract.balanceOf(address(this))
    );
  }

  /**
   * @dev Gets the current state of a contract ("pending", "fulfilled" or "expired")
   */
  function getState() external view returns (bytes32 state) {
    if (state == bytes32("fulfilled")) {
      return "fulfilled";
    }
    // solhint-disable-next-line not-rely-on-time
    if (block.timestamp > expirationTime) {
      return "expired";
    }
    return "pending";
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
  modifier onlyDirectRequestAggregator {
    require(msg.sender == address(aggregatorContract), "Not aggregator");
    _;
  }
}