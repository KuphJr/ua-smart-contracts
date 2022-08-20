// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.0;

import {svg} from "hot-chain-svg/SVG.sol";
import {utils} from "hot-chain-svg/Utils.sol";
import {Base64} from "base64/base64.sol";
import {Strings} from "./utils/Strings.sol";

import {Agreement} from "./Agreement.sol";

library DataURI {
    function toDataURI(string memory data, string memory mimeType)
        internal
        pure
        returns (string memory)
    {
        return
            string.concat(
                "data:",
                mimeType,
                ";base64,",
                Base64.encode(abi.encodePacked(data))
            );
    }
}

library Render {
    function json(
        uint256 _tokenId,
        string memory _svg,
        Agreement _agreement
    ) internal view returns (string memory) {
        return
            string.concat(
                '{"name": "uApp Agreement',
                " #",
                utils.uint2str(_tokenId),
                '", "description": "A trust-minimised agreement powered by the Universal Adapter", "image": "',
                _svg,
                '", "attributes": ',
                attributes(_tokenId, _agreement),
                "}"
            );
    }

    function attributes(uint256 _tokenId, Agreement _agreement)
        internal
        view
        returns (string memory)
    {
        return
            string.concat(
                "[",
                attribute("Agreement", utils.uint2str(_tokenId)),
                ",",
                attribute("Contract", _substringAddress(address(_agreement))),
                ",",
                attribute(
                    "Balance",
                    _agreement.state() == Agreement.States.FULFILLED
                        ? utils.uint2str(_agreement.result())
                        : utils.uint2str(address(_agreement).balance)
                ),
                ",",
                attribute(
                    "Creator",
                    _substringAddress(address(_agreement.owner()))
                ),
                ",",
                attribute(
                    "Redeemer",
                    _substringAddress(address(_agreement.redeemer()))
                ),
                ",",
                attribute("Deadline", utils.uint2str(_agreement.deadline())),
                ",",
                attribute(
                    "Soulbound",
                    _agreement.soulbound() ? "true" : "false"
                ),
                ",",
                attribute("State", _stateToString(uint8(_agreement.state()))),
                "]"
            );
    }

    function attribute(string memory name, string memory value)
        internal
        pure
        returns (string memory)
    {
        return
            string.concat(
                '{"trait_type": "',
                name,
                '", "value": "',
                value,
                '"}'
            );
    }

    function image(uint256 _tokenId, Agreement _agreement)
        internal
        view
        returns (string memory)
    {
        return
            string.concat(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" style="background:',
                _stateToBg(uint8(_agreement.state())),
                ';font-family:Helvetica Neue, Helvetica, Arial, sans-serif;">',
                svg.el(
                    "path",
                    string.concat(
                        svg.prop("id", "top"),
                        svg.prop(
                            "d",
                            "M 10 10 H 280 a10,10 0 0 1 10,10 V 280 a10,10 0 0 1 -10,10 H 20 a10,10 0 0 1 -10,-10 V 10 z"
                        ),
                        svg.prop("fill", _stateToBg(uint8(_agreement.state())))
                    ),
                    ""
                ),
                svg.el(
                    "path",
                    string.concat(
                        svg.prop("id", "bottom"),
                        svg.prop(
                            "d",
                            "M 290 290 H 20 a10,10 0 0 1 -10,-10 V 20 a10,10 0 0 1 10,-10 H 280 a10,10 0 0 1 10,10 V 290 z"
                        ),
                        svg.prop("fill", _stateToBg(uint8(_agreement.state())))
                    ),
                    ""
                ),
                svg.text(
                    string.concat(
                        svg.prop("dominant-baseline", "middle"),
                        svg.prop("font-family", "Menlo, monospace"),
                        svg.prop("font-size", "9"),
                        svg.prop("fill", "white")
                    ),
                    string.concat(
                        svg.el(
                            "textPath",
                            string.concat(svg.prop("href", "#top")),
                            string.concat(
                                formatAgreement(_agreement),
                                svg.el(
                                    "animate",
                                    string.concat(
                                        svg.prop(
                                            "attributeName",
                                            "startOffset"
                                        ),
                                        svg.prop("from", "0%"),
                                        svg.prop("to", "100%"),
                                        svg.prop("dur", "120s"),
                                        svg.prop("begin", "0s"),
                                        svg.prop("repeatCount", "indefinite")
                                    ),
                                    ""
                                )
                            )
                        )
                    )
                ),
                svg.text(
                    string.concat(
                        svg.prop("x", "50%"),
                        svg.prop("y", "45%"),
                        svg.prop("text-anchor", "middle"),
                        svg.prop("dominant-baseline", "middle"),
                        svg.prop("font-size", "150"),
                        svg.prop("font-weight", "bold"),
                        svg.prop("fill", "white")
                    ),
                    string.concat(svg.cdata("UA"))
                ),
                svg.text(
                    string.concat(
                        svg.prop("x", "50%"),
                        svg.prop("y", "70%"),
                        svg.prop("text-anchor", "middle"),
                        svg.prop("font-size", "20"),
                        svg.prop("fill", "white")
                    ),
                    string.concat("#", utils.uint2str(_tokenId))
                ),
                svg.text(
                    string.concat(
                        svg.prop("x", "50%"),
                        svg.prop("y", "80%"),
                        svg.prop("text-anchor", "middle"),
                        svg.prop("font-size", "20"),
                        svg.prop("fill", "white")
                    ),
                    string.concat(
                        _agreement.state() == Agreement.States.FULFILLED
                            ? utils.uint2str(_agreement.result())
                            : utils.uint2str(address(_agreement).balance),
                        " MATIC"
                    )
                ),
                svg.text(
                    string.concat(
                        svg.prop("dominant-baseline", "middle"),
                        svg.prop("font-family", "Menlo, monospace"),
                        svg.prop("font-size", "9"),
                        svg.prop("fill", "white")
                    ),
                    string.concat(
                        svg.el(
                            "textPath",
                            string.concat(svg.prop("href", "#bottom")),
                            string.concat(
                                formatAgreement(_agreement),
                                svg.el(
                                    "animate",
                                    string.concat(
                                        svg.prop(
                                            "attributeName",
                                            "startOffset"
                                        ),
                                        svg.prop("from", "0%"),
                                        svg.prop("to", "100%"),
                                        svg.prop("dur", "120s"),
                                        svg.prop("begin", "0s"),
                                        svg.prop("repeatCount", "indefinite")
                                    ),
                                    ""
                                )
                            )
                        )
                    )
                ),
                "</svg>"
            );
    }

    function formatAgreement(Agreement _agreement)
        internal
        view
        returns (string memory)
    {
        return
            svg.cdata(
                string.concat(
                    "Agreement ",
                    _substringAddress(address(_agreement)),
                    " | creator: ",
                    _substringAddress(address(_agreement.owner())),
                    " | redeemer: ",
                    _substringAddress(address(_agreement.redeemer())),
                    " | deadline: ",
                    utils.uint2str(_agreement.deadline())
                )
            );
    }

    function _substringAddress(address _address)
        internal
        pure
        returns (string memory)
    {
        string memory stringAddress = Strings.toString(_address);
        return
            string(
                abi.encodePacked(
                    "0x",
                    Strings.substring(stringAddress, 0, 4),
                    "...",
                    Strings.substring(
                        stringAddress,
                        bytes(stringAddress).length - 4,
                        4
                    )
                )
            );
    }

    function _stateToString(uint8 state)
        internal
        pure
        returns (string memory str)
    {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            str := mload(0x40)
            mstore(str, 0x20)
            switch state
            case 0 {
                mstore(add(str, 0x07), 0x0750454e44494e47)
            }
            case 1 {
                mstore(add(str, 0x09), 0x0946554c46494c4c4544)
            }
            case 2 {
                mstore(add(str, 0x09), 0x0943414e43454c4c4544)
            }
            case 3 {
                mstore(add(str, 0x07), 0x0745585049524544)
            }
            mstore(0x40, add(str, 0x60))
        }
    }

    function _stateToBg(uint8 state) internal pure returns (string memory str) {
        if (state == 0) {
            str = "#FFA500";
        } else if (state == 1) {
            str = "#00FF00";
        } else if (state == 2) {
            str = "#FF0000";
        } else if (state == 3) {
            str = "#808080";
        }
    }
}
