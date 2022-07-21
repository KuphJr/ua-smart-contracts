// SPDX-License-Identifier: MIT
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

    constructor(
      LinkTokenInterface _linkToken,
      IUniversalAdapter _universalAdapter
    ) ERC721("Universal Adapter Protocol", "uApp") Owned(msg.sender) {
        linkToken = _linkToken;
        universalAdapter = _universalAdapter;
    }

    function createAgreement(
        address redeemer,
        uint256 deadline,
        bool soulbound,
        uint256 maxPayout,
        bytes memory data
    ) external returns (Agreement agreement) {
        require(redeemer != address(0), "REDEEMER");
        // solhint-disable-next-line not-rely-on-time
        require(deadline > block.timestamp, "DEADLINE");
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
            agreementId,
            msg.sender,
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
        require(_ownerOf[id] != address(0), "INVALID");
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
        // solhint-disable quotes
        uri = string(abi.encodePacked(
          '"address":"', address(agreement).toString(),
          '","balance":"', linkToken.balanceOf(address(agreement)).toString(),
          '","creator":"', agreement.owner().toString(),
          '","redeemer":"', _ownerOf[id].toString(),
          '","soulbound":"', agreement.soulbound() ? "true" : "false",
          '","state":"', _stateToString(agreement.state()),
          '","deadline":"', agreement.deadline().toString(),
          '","image":"', _imageData
        ));
        // solhint-enable quotes
    }

    function transferFrom(
        address from,
        address to,
        uint256 id
    ) public override {
        require(!agreements[id].soulbound(), "SOULBOUND");
        super.transferFrom(from, to, id);
    }

    // function _stateToString(uint8 state) internal pure returns (string memory str) {
    //     // solhint-disable-next-line no-inline-assembly
    //     assembly {
    //         str := mload(0x40)
    //         mstore(str, 0x20)
    //         switch state
    //         case 0 { mstore(add(str, 0x07), 0x0750454e44494e47) }
    //         case 1 { mstore(add(str, 0x05), 0x0946554c46494c4c4544) }
    //         case 2 { mstore(add(str, 0x05), 0x0943414e43454c4c4544) }
    //         case 3 { mstore(add(str, 0x07), 0x0745585049524544) }
    //         mstore(0x40, add(str, 0x60))
    //     }
    // }
    function _stateToString(Agreement.States state) internal pure returns (string memory str) {
        if (state == Agreement.States.PENDING) {
            return "PENDING";
        }
        if (state == Agreement.States.FULFILLED) {
            return "FULFILLED";
        }
        if (state == Agreement.States.CANCELLED) {
            return "CANCELLED";
        }
        return "EXPIRED";
    }
}