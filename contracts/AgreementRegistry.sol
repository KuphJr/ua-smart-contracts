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

contract AgreementRegistry is ERC721, Owned {
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

        emit AgreementCreated(agreementId, agreement);
    }

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");
        Agreement agreement = agreements[id];

        uri = string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            "{'name': '",
                            string(abi.encodePacked("uApp Agreement #", id.toString())),
                            "', 'description': 'A trust-minimised agreement powered by the Universal Adapter', ",
                            "'attributes': [{'trait_type': 'Agreement', 'value': '",
                            id.toString(),
                            "'}, {'trait_type': 'Contract', 'value': '",
                            _substringAddress(address(agreement)),
                            "'}, {'trait_type': 'Balance', 'value': '",
                            agreement.state() == Agreement.States.FULFILLED
                                ? agreement.result()
                                : linkToken.balanceOf(address(agreement)),
                            "'}, {'trait_type': 'Creator', 'value': '",
                            _substringAddress(address(agreement.owner())),
                            "'}, {'trait_type': 'Redeemer', 'value': '",
                            _substringAddress(address(agreement.redeemer())),
                            "'}, {'trait_type': 'Deadline', 'value': '",
                            agreement.deadline().toString(),
                            "'}, {'trait_type': 'Soulbound', 'value': '",
                            agreement.soulbound() ? "true" : "false",
                            "'}, {'trait_type': 'State', 'value': '",
                            _stateToString(uint8(agreement.state())),
                            "'}], ",
                            "'image_data': ",
                            string(
                                abi.encodePacked(
                                    "data:image/svg+xml;base64,",
                                    Base64.encode(
                                        bytes(
                                            BitPackedMap._renderSvg(
                                                _generateBitmap(
                                                    agreement
                                                )
                                            )
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

    function _substringAddress(
        address _address
    ) internal pure returns (bytes memory) {
        string memory stringAddress = _address.toString();
        return abi.encodePacked(
            "0x",
            stringAddress.substring(0, 4),
            "...",
            stringAddress.substring(bytes(stringAddress).length - 4, 4)
        );
    }

    function _stateToString(uint8 state) internal pure returns (string memory) {
        assembly {
            mstore(0x20, 0x20)
            switch state
            case 0 { mstore(0x47, 0x0750454e44494e47) }
            case 1 { mstore(0x45 , 0x0946554c46494c4c4544) }
            case 2 { mstore(0x45 , 0x0943414e43454c4c4544) }
            case 3 { mstore(0x47, 0x0745585049524544) }
            return(0x20, 0x60)
        }
    }

    function _generateBitmap(Agreement agreement) internal view returns (bytes32 bitmap) {
        bytes4 mask = 0xFFFFFFFF;
        bytes4 _id = BitPackedMap._uintToHexDigit(uint8(agreement.agreementId() % 16)) & mask;
        bytes4 _agreement = BitPackedMap._uintToHexDigit(uint8(uint256(uint160(address(agreement))) % 16)) & mask;
        bytes4 _balance = (
            BitPackedMap._uintToHexDigit(
                uint8(
                    agreement.state() == Agreement.States.FULFILLED
                        ? agreement.result()
                        : linkToken.balanceOf(address(agreement))
                ) % 16
            )
        ) & mask;
        bytes4 _creator = BitPackedMap._uintToHexDigit(uint8(uint256(uint160(address(msg.sender))) % 16)) & mask;
        bytes4 _redeemer = BitPackedMap._uintToHexDigit(uint8(uint256(uint160(address(agreement.redeemer()))) % 16)) & mask;
        bytes4 _deadline = BitPackedMap._uintToHexDigit(uint8(agreement.deadline() % 16)) & mask;
        bytes4 _soul = BitPackedMap._uintToHexDigit(uint8(agreement.soulbound() ? 10 : 11)) & mask;
        bytes4 _state = BitPackedMap._uintToHexDigit(uint8(agreement.state())) & mask;
        bitmap = bytes32(bytes.concat(_id, _agreement, _balance, _creator, _redeemer, _deadline, _soul, _state));
    }
}