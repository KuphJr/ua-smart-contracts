// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import {Strings} from "./utils/Strings.sol";
import {LinkTokenInterface} from "chainlink/interfaces/LinkTokenInterface.sol";
import {Base64} from "base64/base64.sol";
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

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");
        Agreement agreement = agreements[id];

        string memory _imageData = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(
                    bytes(
                        _renderSvg(
                            keccak256(
                                abi.encodePacked(
                                    agreement
                                )
                            )
                        )
                    )
                )
            )
        );

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
                                ? agreement.result().toString()
                                : linkToken.balanceOf(address(agreement)).toString(),
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
                            _imageData,
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

    function setUniversalAdapter(IUniversalAdapter _universalAdapter) external onlyOwner {
        universalAdapter = _universalAdapter;
    }

    function setRequestCost(uint256 _requestCost) external onlyOwner {
        requestCost = _requestCost;
    }

    function _substringAddress(
        address _address
    ) internal pure returns (string memory) {
        string memory stringAddress = _address.toString();
        return string(
            abi.encodePacked(
                "0x",
                stringAddress.substring(0, 4),
                "...",
                stringAddress.substring(bytes(stringAddress).length - 4, 4)
            )
        );
    }

    function _stateToString(uint8 state) internal pure returns (string memory str) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            str := mload(0x40)
            mstore(str, 0x20)
            switch state
            case 0 { mstore(add(str, 0x07), 0x0750454e44494e47) }
            case 1 { mstore(add(str, 0x09) , 0x0946554c46494c4c4544) }
            case 2 { mstore(add(str, 0x09) , 0x0943414e43454c4c4544) }
            case 3 { mstore(add(str, 0x07), 0x0745585049524544) }
            mstore(0x40, add(str, 0x60))
        }
    }

    function _renderSvg(bytes32 hash) internal pure returns (string memory svgString) {
        svgString = string(abi.encodePacked(
            "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>", 
            string(abi.encodePacked("<rect fill='#", _fromCode(bytes4(hash)), "' width='100%' height='100%' />")),
            "</svg>"
        ));
    }

    function _toHexDigit(uint8 d) internal pure returns (bytes1) {
        if (0 <= d && d <= 9) {
            return bytes1(uint8(bytes1('0')) + d);
        }
        if (10 <= uint8(d) && uint8(d) <= 15) {
            return bytes1(uint8(bytes1('a')) + d - 10);
        }
        revert();
    }

    function _fromCode(bytes4 code) internal pure returns (string memory) {
        bytes memory result = new bytes(6);
        for (uint i = 0; i < 3; ++i) {
            result[2 * i] = _toHexDigit(uint8(code[i]) / 16);
            result[2 * i + 1] = _toHexDigit(uint8(code[i]) % 16);
        }
        return string(result);
    }
}