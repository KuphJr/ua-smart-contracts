// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import {BitPackedMap} from "./utils/BitPackedMap.sol";
import {Strings} from "./utils/Strings.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Base64} from "base64-sol/base64.sol";
import {ERC20} from "@solmate/tokens/ERC20.sol";
import {ERC721} from "@solmate/tokens/ERC721.sol";
import {Owned} from "@solmate/auth/Owned.sol";
import {SafeTransferLib} from "@solmate/utils/SafeTransferLib.sol";

contract AgreementRegistry is BitPackedMap, ERC721, Owned {
    using SafeTransferLib for ERC20;
    using Strings for address;
    using Strings for string;
    using Strings for uint256;

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

        // TODO: bitmap construction logic (current value is an example from repo https://github.com/kadenzipfel/bit-packed-map/)
        bytes32 bitmap = 0x7624778dedc75f8b322b9fa1632a610d40b85e106c7d9bf0e743a9ce291b9c63;
        _addBitmap(agreementId, bitmap);

        emit AgreementCreated(agreementId, agreement);
    }

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");

        Agreement agreement = agreements[id];
        string memory owner = agreement.owner().toString();
        string memory redeemer = agreement.redeemer().toString();

        uri = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            "{'name': '",
                            string(abi.encodePacked("uApp Agreement #", id.toString())),
                            "', 'description': 'A trust-minimised agreement powered by the Universal Adapter', ",
                            "'attributes': [{'trait_type': 'Contract', 'value': '",
                            agreement,
                            "'}, {'trait_type': 'Balance', 'value': '",
                            linkToken.balanceOf(address(agreement)),
                            "'}, {'trait_type': 'owner', 'value': '",
                            abi.encodePacked(
                                "0x",
                                owner.substring(0, 4),
                                "...",
                                owner.substring(bytes(owner).length - 4, 4)
                            ),
                            "'}, {'trait_type': 'Redeemer', 'value': '",
                            abi.encodePacked(
                                "0x",
                                redeemer.substring(0, 4),
                                "...",
                                redeemer.substring(bytes(redeemer).length - 4, 4)
                            ),
                            "'}, {'trait_type': 'Soulbound', 'value': '",
                            agreement.soulbound(),
                            "'}, {'trait_type': 'State', 'value': '",
                            agreement.state(),
                            "'}], ",
                            "'image_data': ",
                            string(
                                abi.encodePacked(
                                    "data:image/svg+xml;base64,",
                                    Base64.encode(
                                        bytes(
                                            tokenSvg(id)
                                        )
                                    )
                                )
                            ),
                            "'}"
                        )
                    )
                )
            )
        );
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