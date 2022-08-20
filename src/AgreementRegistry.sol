// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import {LinkTokenInterface} from "chainlink/interfaces/LinkTokenInterface.sol";
import {Base64} from "base64/base64.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {ERC721} from "@solmate/tokens/ERC721.sol";
import {Owned} from "@solmate/auth/Owned.sol";
import {SafeTransferLib} from "@solmate/utils/SafeTransferLib.sol";
import {DataURI, Render} from "./Render.sol";

contract AgreementRegistry is ERC721, Owned {
    using SafeTransferLib for ERC20;
    using DataURI for string;

    LinkTokenInterface private linkToken;
    IUniversalAdapter private universalAdapter;
    uint256 public requestCost;
    uint256 public ids;
    mapping(address => uint256) private nonces;
    Agreement[] public agreements;
    mapping(address => uint256[]) public creatorAgreements;
    mapping(address => uint256[]) public redeemerAgreements;

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
        bytes calldata data
    ) external returns (Agreement agreement) {
        require(redeemer != address(0), "INVALID_REDEEMER");
        // solhint-disable-next-line not-rely-on-time
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
            data
        );

        ERC20(address(linkToken)).safeTransferFrom(msg.sender, address(agreement), maxPayout);

        agreements.push(agreement);
        creatorAgreements[msg.sender].push(agreementId);
        redeemerAgreements[redeemer].push(agreementId);
        
        _safeMint(redeemer, agreementId);

        emit AgreementCreated(agreementId, agreement);
    }

    function tokenJSON(uint256 id)
        public
        view
        returns (string memory)
    {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");
        return Render.json(id, tokenSVG(id).toDataURI("image/svg+xml"), agreements[id]);
    }

    function tokenSVG(uint256 id)
        public
        view
        returns (string memory)
    {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");
        return Render.image(id, agreements[id]);
    }

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");
        return tokenJSON(id).toDataURI("application/json");
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override {
        require(!agreements[id].soulbound(), "SOULBOUND");
        super.transferFrom(from, to, id);
    }

    function setUniversalAdapter(IUniversalAdapter _universalAdapter) external onlyOwner {
        universalAdapter = _universalAdapter;
    }

    function setRequestCost(uint256 _requestCost) external onlyOwner {
        requestCost = _requestCost;
    }
}