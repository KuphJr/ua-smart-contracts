// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Agreement} from "./Agreement.sol";
import {ERC721} from "@solmate/tokens/ERC721.sol";
import {Owned} from "@solmate/auth/Owned.sol";

contract AgreementRegistry is ERC721, Owned {
    LinkTokenInterface private linkToken;
    IUniversalAdapter private universalAdapter;
    uint256 public requestCost;
    uint256 public ids;
    // TODO: mapping creator => agreements, redeemer => agreements etc.
    mapping(address => uint256) private nonces;

    constructor(
        LinkTokenInterface _linkToken,
        IUniversalAdapter _universalAdapter,
        uint256 _requestCost
    ) ERC721("UniversalAdapterAgreement", "UAA") Owned(msg.sender) {
        linkToken = _linkToken;
        universalAdapter = _universalAdapter;
        requestCost = _requestCost;
    }

    function createAgreement(
        address redeemer,
        uint256 deadline,
        bool soulbound,
        string calldata js,
        string calldata cid,
        string calldata vars,
        string calldata ref
    ) external returns (Agreement agreement) {
        require(redeemer != address(0), "INVALID_REDEEMER");
        require(deadline > block.timestamp, "INVALID_DEADLINE");
        uint256 agreementId = ++ids;

        // Use the CREATE2 opcode to deploy a new Agreement contract.
        // Unchecked as creator nonce cannot realistically overflow.
        unchecked {
            bytes32 salt = keccak256(
                abi.encodePacked(
                    msg.sender,
                    redeemer,
                    ++nonces[msg.sender]
                )
            );   
        }
        
        agreement = new Agreement{salt: salt}(
            linkToken,
            universalAdapter,
            requestCost,
            agreementId,
            redeemer,
            deadline,
            soulbound,
            js,
            cid,
            vars,
            ref
        );
        
        // TODO: populate mappings
        // TODO: mint agreementId to recipient
        // TODO: soulbound checks (override transfer fns)
    }

    // TODO: cancel agreement

    // TODO: recover funds

    function setLinkToken(LinkTokenInterface _linkToken) external onlyOwner {
        linkToken = _linkToken;
    }

    function setUniversalAdapter(IUniversalAdapter _universalAdapter) external onlyOwner {
        universalAdapter = _universalAdapter;
    }

    function setRequestCost(uint256 _requestCost) external onlyOwner {
        requestCost = _requestCost;
    }
}