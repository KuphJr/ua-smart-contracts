// SPDX-License-Identifier: MIT
// I prefer to use this version of Solidity because it is better supported by HardHat if that is okay.
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import {Base64} from "base64-sol/base64.sol";
import {Strings} from "./utils/Strings.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {BitPackedMap} from "./utils/BitPackedMap.sol";

contract AgreementRegistry is Owned, ERC721 {
    using Strings for address;
    using Strings for string;
    using Strings for uint256;

    LinkTokenInterface private linkToken;
    IUniversalAdapter private universalAdapter;
    uint256 public ids;
    mapping(address => uint256) private nonces;
    Agreement[] public agreements;
    mapping(address => uint[]) public creatorAgreements;
    mapping(address => uint[]) public redeemerAgreements;

    event AgreementCreated(uint256 indexed agreementId, address agreementContractAddress, Agreement agreement);

    constructor() ERC721("Universal Adapter Protocol", "uApp") Owned(msg.sender) {
        linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        universalAdapter = IUniversalAdapter(0x5526B90295EcAbB23E4ce210511071843C8EE955);
    }

    function createAgreement(
        address redeemer,
        uint256 deadline,
        bool soulbound,
        uint256 maxPayout,
        bytes memory data
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
        // Cool use of salt here!  I had to look it up: https://docs.soliditylang.org/en/v0.8.3/control-structures.html?highlight=salt#salted-contract-creations-create2
        agreement = new Agreement{salt: salt}(
            address(this),
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

        _safeMint(redeemer, agreementId);

        emit AgreementCreated(agreementId, address(agreement), agreement);
    }

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        require(_ownerOf[id] != address(0), "INVALID_TOKEN");
        Agreement agreement = agreements[id];

        string memory _imageData = string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(
                    bytes(
                        BitPackedMap._renderSvg(
                            // _generateBitmap(
                            //     agreement
                            // )
                            bytes16(
                                keccak256(
                                    abi.encodePacked(
                                        agreement
                                    )
                                )
                            )
                        )
                    )
                )
            )
        );
        string memory uriPart1 = string(abi.encodePacked(
          '{"name":"uApp Agreement #', id.toString(), // solhint-disable-line quotes
          '","address":"', address(agreement).toString(), // solhint-disable-line quotes
          '","balance":"', linkToken.balanceOf(address(agreement)).toString(), // solhint-disable-line quotes
          '","creator":"', agreement.owner().toString(), // solhint-disable-line quotes
          '","owner":"', agreement.redeemer().toString(), // solhint-disable-line quotes
          '","soulbound":"', agreement.soulbound() ? "true" : "false", // solhint-disable-line quotes
          '","state":"', _stateToString(uint8(agreement.state())) // solhint-disable-line quotes
        ));
        string memory uriPart2 = string(abi.encodePacked(
          '","deadline":"', agreement.deadline().toString(), // solhint-disable-line quotes
          '","image_data":"', _imageData, // solhint-disable-line quotes
          '"}' // solhint-disable-line quotes
        ));
        return string(abi.encodePacked(uriPart1, uriPart2));
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override {
        require(!agreements[id].soulbound(), "SOULBOUND");
        super.transferFrom(from, to, id);
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
            case 1 { mstore(add(str, 0x05) , 0x0946554c46494c4c4544) }
            case 2 { mstore(add(str, 0x05) , 0x0943414e43454c4c4544) }
            case 3 { mstore(add(str, 0x07), 0x0745585049524544) }
            mstore(0x40, add(str, 0x60))
        }
    }
}