// SPDX-License-Identifier: MIT
// I prefer to use this version of Solidity because it is better supported by HardHat if that is okay.
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";

contract AgreementRegistry is Owned {
    LinkTokenInterface private linkToken;
    IUniversalAdapter private universalAdapter;
    uint256 public requestCost;
    uint256 public ids;
    mapping(address => uint256) private nonces;
    Agreement[] public agreements;
    mapping(address => uint[]) public creatorAgreements;
    mapping(address => uint[]) public redeemerAgreements;

    event AgreementCreated(uint256 indexed agreementId, address agreementContractAddress, Agreement agreement);

    constructor(
        // I am unsure of how to deploy these by taking interfaces as arguments.
        // I only know how to use the contract address and create an instance of the contract interface.
        address _linkToken,
        address _universalAdapter,
        uint256 _requestCost
    ) Owned(msg.sender) {
        linkToken = LinkTokenInterface(_linkToken);
        universalAdapter = IUniversalAdapter(_universalAdapter);
        requestCost = _requestCost;
    }

    function createAgreement(
        address redeemer,
        uint256 deadline,
        bool soulbound,
        uint256 maxPayout,
        bytes memory data
    ) external returns (Agreement agreement) {
        require(redeemer != address(0), "INVALID_REDEEMER");
        require(deadline > block.timestamp, "INVALID_DEADLINE");
        uint256 agreementId = ids++;

        // Use the CREATE2 opcode to deploy a new Agreement contract.
        // Unchecked as creator nonce cannot realistically overflow.
        bytes32 salt;
        unchecked {
            salt = keccak256(
                abi.encodePacked(
                    msg.sender,
                    redeemer,
                    nonces[msg.sender]++
                )
            );
        }
        // Cool use of salt here!  I had to look it up: https://docs.soliditylang.org/en/v0.8.3/control-structures.html?highlight=salt#salted-contract-creations-create2
        agreement = new Agreement{salt: salt}(
            linkToken,
            universalAdapter,
            address(this),
            requestCost,
            agreementId,
            msg.sender,
            redeemer,
            deadline,
            soulbound,
            data
        );
        linkToken.transferFrom(msg.sender, address(agreement), maxPayout);

        agreements.push(agreement);
        creatorAgreements[msg.sender].push(agreementId);
        redeemerAgreements[redeemer].push(agreementId);

        emit AgreementCreated(agreementId, address(agreement), agreement);
    }

    function setRequestCost(uint256 _requestCost) external onlyOwner {
        requestCost = _requestCost;
    }

    // all the setter functions were unnecessary.  Those values should all be immutable.
}