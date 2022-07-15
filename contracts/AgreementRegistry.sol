// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Agreement} from "./Agreement.sol";
import "./interfaces/IUniversalAdapter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {ERC721} from "@solmate/tokens/ERC721.sol";
import {Owned} from "@solmate/auth/Owned.sol";
import {SafeTransferLib} from "@solmate/utils/SafeTransferLib.sol";

contract AgreementRegistry is ERC721, Owned {
    using SafeTransferLib for ERC20;

    LinkTokenInterface private linkToken;
    IUniversalAdapter private universalAdapter;
    uint256 public requestCost;
    uint256 public ids;
    mapping(address => uint256) private nonces;
    Agreement[] public agreements;
    mapping(address => uint[]) public creatorAgreements;
    mapping(address => uint[]) public redeemerAgreements;

    event AgreementCreated(uint256 indexed agreementId, Agreement agreement);

    constructor(
        LinkTokenInterface _linkToken,
        IUniversalAdapter _universalAdapter,
        uint256 _requestCost
    ) ERC721("Universal Adapter Protocol", "uApp") Owned(msg.sender) {
        linkToken = _linkToken;
        universalAdapter = _universalAdapter;
        requestCost = _requestCost;
    }

    function createAgreement(
        address redeemer,
        uint256 deadline,
        bool soulbound,
        uint256 maxPayout,
        string calldata js,
        string calldata cid,
        string calldata vars,
        string calldata ref
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
            js,
            cid,
            vars,
            ref
        );

        ERC20(address(linkToken)).safeTransferFrom(msg.sender, address(agreement), maxPayout);

        agreements.push(agreement);
        creatorAgreements[msg.sender].push(agreementId);
        creatorAgreements[redeemer].push(agreementId);
        
        _safeMint(redeemer, agreementId);
        emit AgreementCreated(agreementId, agreement);
    }

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        // TODO: metadata logic
        // https://github.com/kadenzipfel/bit-packed-map
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override {
        require(!agreements[id].soulbound(), "SOULBOUND");
        super.transferFrom(from, to, id);
    }

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