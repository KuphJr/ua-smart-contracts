// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IUniversalAdapter.sol";
import {Agreement} from "./Agreement.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/ERC677ReceiverInterface.sol";
import {Base64} from "base64-sol/base64.sol";
import {Strings} from "./utils/Strings.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {BitPackedMap} from "./utils/BitPackedMap.sol";

contract AgreementRegistry is Owned, ERC721, ERC677ReceiverInterface {
    using Strings for address;
    using Strings for string;
    using Strings for uint256;

    event Created(uint256 agreementId);

    LinkTokenInterface private linkToken;
    IUniversalAdapter private universalAdapter;
    uint256 public ids;
    mapping(address => uint256) private nonces;
    Agreement[] public agreements;
    mapping(address => uint[]) public creatorAgreements;
    mapping(address => uint[]) public redeemerAgreements;

    constructor(
      LinkTokenInterface _linkToken,
      IUniversalAdapter _universalAdapter
    ) ERC721("Universal Adapter", "uApp") Owned(msg.sender) {
        linkToken = _linkToken;
        universalAdapter = _universalAdapter;
    }

    // This is the 'create' function
    function onTokenTransfer(
      address sender,
      uint amount,
      bytes calldata data
    ) external override {
        address redeemer;
        uint256 deadline;
        bool soulbound;
        uint256 maxPayout;
        bytes memory data;
        (
          address redeemer,
          uint256 deadline,
          bool soulbound,
          uint256 maxPayout,
          bytes memory agreementData          
        ) = abi.decode(data (address, uint256, bool, uint256, bytes));
        require(redeemer != address(0), "INVALID_REDEEMER");
        require(amount == maxPayout, "INCORRECT_AMOUNT");
        // solhint-disable-next-line not-rely-on-time
        require(deadline > block.timestamp, "DL");
        uint256 agreementId = ids++;

        // Use the CREATE2 opcode to deploy a new Agreement contract.
        // Unchecked as creator nonce cannot realistically overflow.
        bytes32 salt;
        unchecked {
            salt = keccak256(
                abi.encodePacked(
                    sender,
                    redeemer,
                    nonces[sender]++
                )
            );
        }

        Agreement agreement = new Agreement{salt: salt}(
            linkToken,
            universalAdapter,
            address(this),
            agreementId,
            sender,
            deadline,
            soulbound,
            agreementData
        );

        agreements.push(agreement);
        creatorAgreements[msg.sender].push(agreementId);
        redeemerAgreements[redeemer].push(agreementId);

        _safeMint(redeemer, agreementId);
        emit Created(agreementId);
    }

    function tokenURI(uint256 id) public view override returns (string memory uri) {
        require(_ownerOf[id] != address(0), "ID");
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
          '","state":"', agreement.state().toString(),
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
        require(!agreements[id].soulbound(), "BOUND");
        super.transferFrom(from, to, id);
    }
}