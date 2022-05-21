// "SPDX-License-Identifier: MIT"
pragma solidity >=0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

interface DirectRequestAggregatorInterface {
  function makeRequest(
    address callbackAddress,
    bytes4 callbackFunctionId,
    string calldata js,
    string calldata cid,
    string calldata vars,
    bytes32 ref
  ) external returns (uint roundId);
}

interface OfferRegistryInterface {
  function registerOffer(
    address offerer,
    address offeree,
    string calldata scriptIpfsHash,
    uint maxOfferValue
  ) external returns (uint registryNumber);
}

contract Requester {
  /*
   * The 3 variables below will not change between contract instances,
   * unless the contract is deployed to a different blockchain.
   */ 
  LinkTokenInterface public linkTokenContract;
  DirectRequestAggregatorInterface public aggregatorContract;
  OfferRegistryInterface public registryContract;

  // The 5 variables below will be set when this contract is deployed and initalized.
  address public offerer;
  address public offeree;
  string public scriptIpfsHash;
  uint public expirationTime;
  uint public registryIndex;

  // Holds the state of the contract.  false = "pending" or true = "fulfilled"
  bool public isFulfilled;
  // holds the number of the request returned by the aggregator contract
  uint public requestNumber;

  event RequestSent(
    address callbackAddress,
    bytes4 callbackFunctionId,
    string js,
    string cid,
    string vars,
    bytes32 ref,
    uint registryIndex,
    uint requestNumber
  );
  event OfferFulfilled(
    uint paymentAmount,
    uint registryIndex,
    uint requestNumber
  );
  event ExpiredOfferFulfilled(
    uint expiredPaymentAmount,
    uint registryIndex,
    uint requestNumber
  );

  /**
   * @dev A brand deploys a separate instance of this contract for each individual sponsorship
   * deal they want to offer an influencer.
   * @param _link The address of the LINK token contract
   * @param _aggregator The address of the aggregator contract for Universal Adapter direct requests
   * @param _registry The address of the registry contract
   * @param _offeree The address of the influencer who is being offered the contract
   * @param _scriptIpfsHash The content identifer for the JavaScript code that has been uploaded
   * to IPFS. This code contains the logic which determines how much an influcer is paid.
   * @param expiration The number of seconds from now when the offer will expire
  */
  constructor (
    address _link,
    address _aggregator,
    address _registry,
    address _offeree,
    string memory _scriptIpfsHash,
    uint expiration
  ) {
    linkTokenContract = LinkTokenInterface(_link);
    aggregatorContract = DirectRequestAggregatorInterface(_aggregator);
    registryContract = OfferRegistryInterface(_registry);
    offerer = msg.sender;
    offeree = _offeree;
    scriptIpfsHash = _scriptIpfsHash;
    // solhint-disable-next-line not-rely-on-time
    expirationTime = expiration + block.timestamp;
  }

  /**
   * @dev This function is called by a brand to add LINK to the contract to pay an influencer.
   * It also registers with the registry contract.
   * @notice Before this function can be called, the offerer must approve a LINK allowance equal to the maxOfferValue.
   */
  function initalizeOffer(
    uint maxOfferValue
  ) public onlyOfferer {
    linkTokenContract.transferFrom(offerer, address(this), maxOfferValue);
    registryIndex = registryContract.registerOffer(
      offerer,
      offeree,
      scriptIpfsHash,
      maxOfferValue
    );
  }

  /**
    @dev This function is called by the influencer to fulfill a brand integration offer and
    initiate the Universal Adapter direct request to calculate and send the amount earned.
    @notice This function must be called AFTER the influencer approves 1 LINK to be spend
    * by this contract in order to pay for the request.
    @param tweetId The id of the sponsored tweet
    @param apiKey A functioning Twitter API key
  */
  function fulfillOffer(
    string calldata tweetId,
    string calldata apiKey
  ) public onlyOfferee {
    // solhint-disable-next-line not-rely-on-time
    require(block.timestamp < expirationTime, "Offer expired");
    // future optimization note: have the offeree approve tokens directly to the 
    // aggregatorContract and just pass along the caller's address
    linkTokenContract.transferFrom(
      msg.sender,
      address(this),
      100
    );
    linkTokenContract.approve(
      address(aggregatorContract),
      100
    );
    // the `vars` object must be a JSON formatted string
    // solhint-disable-next-line
    string memory vars = string(abi.encodePacked('{"tweetId":"', tweetId, '","apiKey":"', apiKey, '"}')); // solhint-disable-line
    requestNumber = aggregatorContract.makeRequest(
      address(this),
      this.fulfillDirectRequest.selector,
      "",
      scriptIpfsHash,
      vars,
      ""
    );

    emit RequestSent(
      address(this),
      this.fulfillDirectRequest.selector,
      "",
      scriptIpfsHash,
      vars,
      "",
      registryIndex,
      requestNumber
    );
  }

  /**
    @dev This function is called by the direct request aggregator contract to fulfill the request
    to send the tokens owed to the influencer and send the remaining balance back to the brand
  */
  function fulfillDirectRequest(
    uint _requestNumber,
    uint amountOwed
  ) public onlyDirectRequestAggregator {
    // solhint-disable-next-line not-rely-on-time
    if (block.timestamp > expirationTime) {
      emit ExpiredOfferFulfilled(amountOwed, registryIndex, _requestNumber);
      return;
    }
    isFulfilled = true;
    uint balance = linkTokenContract.balanceOf(address(this));
    if (balance <= amountOwed) {
      linkTokenContract.transfer(
        offeree,
        balance
      );
      return;
    }
    linkTokenContract.transfer(
      offeree,
      amountOwed
    );
    linkTokenContract.transfer(
      offerer,
      linkTokenContract.balanceOf(address(this))
    );
    emit OfferFulfilled(amountOwed, registryIndex, _requestNumber);
  }

  /**
    @dev If the offer has not been fulfilled before the expiration time,
    the brand can recover their locked funds.
  */
  function recoverFunds() public onlyOfferer {
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
    if (isFulfilled == true) {
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