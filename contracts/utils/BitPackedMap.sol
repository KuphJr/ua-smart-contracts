// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

/// @title BitPackedMap
/// @author Modified from https://github.com/kadenzipfel
/// @notice Bitpacked 8x8 bitmap
library BitPackedMap {
    /// @notice Given a value for a square, return the corresponding fill rgb hex string.
    /// @param  square 4 bit uint denoting the color of the square.
    /// @return fill rgb hex string corresponding to square.
    function _getFillFromSquare(uint256 square) internal pure returns (string memory) {
        string[256] memory colors = [
            "#000000",
            "#800000",
            "#008000",
            "#808000",
            "#000080",
            "#800080",
            "#008080",
            "#c0c0c0",
            "#c0dcc0",
            "#a6caf0",
            "#2a3faa",
            "#2a3fff",
            "#2a5f00",
            "#2a5f55",
            "#2a5faa",
            "#2a5fff",
            "#2a7f00",
            "#2a7f55",
            "#2a7faa",
            "#2a7fff",
            "#2a9f00",
            "#2a9f55",
            "#2a9faa",
            "#2a9fff",
            "#2abf00",
            "#2abf55",
            "#2abfaa",
            "#2abfff",
            "#2adf00",
            "#2adf55",
            "#2adfaa",
            "#2adfff",
            "#2aff00",
            "#2aff55",
            "#2affaa",
            "#2affff",
            "#550000",
            "#550055",
            "#5500aa",
            "#5500ff",
            "#551f00",
            "#551f55",
            "#551faa",
            "#551fff",
            "#553f00",
            "#553f55",
            "#553faa",
            "#553fff",
            "#555f00",
            "#555f55",
            "#555faa",
            "#555fff",
            "#557f00",
            "#557f55",
            "#557faa",
            "#557fff",
            "#559f00",
            "#559f55",
            "#559faa",
            "#559fff",
            "#55bf00",
            "#55bf55",
            "#55bfaa",
            "#55bfff",
            "#55df00",
            "#55df55",
            "#55dfaa",
            "#55dfff",
            "#55ff00",
            "#55ff55",
            "#55ffaa",
            "#55ffff",
            "#7f0000",
            "#7f0055",
            "#7f00aa",
            "#7f00ff",
            "#7f1f00",
            "#7f1f55",
            "#7f1faa",
            "#7f1fff",
            "#7f3f00",
            "#7f3f55",
            "#7f3faa",
            "#7f3fff",
            "#7f5f00",
            "#7f5f55",
            "#7f5faa",
            "#7f5fff",
            "#7f7f00",
            "#7f7f55",
            "#7f7faa",
            "#7f7fff",
            "#7f9f00",
            "#7f9f55",
            "#7f9faa",
            "#7f9fff",
            "#7fbf00",
            "#7fbf55",
            "#7fbfaa",
            "#7fbfff",
            "#7fdf00",
            "#7fdf55",
            "#7fdfaa",
            "#7fdfff",
            "#7fff00",
            "#7fff55",
            "#7fffaa",
            "#7fffff",
            "#aa0000",
            "#aa0055",
            "#aa00aa",
            "#aa00ff",
            "#aa1f00",
            "#aa1f55",
            "#aa1faa",
            "#aa1fff",
            "#aa3f00",
            "#aa3f55",
            "#aa3faa",
            "#aa3fff",
            "#aa5f00",
            "#aa5f55",
            "#aa5faa",
            "#aa5fff",
            "#aa7f00",
            "#aa7f55",
            "#aa7faa",
            "#aa7fff",
            "#aa9f00",
            "#aa9f55",
            "#aa9faa",
            "#aa9fff",
            "#aabf00",
            "#aabf55",
            "#aabfaa",
            "#aabfff",
            "#aadf00",
            "#aadf55",
            "#aadfaa",
            "#aadfff",
            "#aaff00",
            "#aaff55",
            "#aaffaa",
            "#aaffff",
            "#d40000",
            "#d40055",
            "#d400aa",
            "#d400ff",
            "#d41f00",
            "#d41f55",
            "#d41faa",
            "#d41fff",
            "#d43f00",
            "#d43f55",
            "#d43faa",
            "#d43fff",
            "#d45f00",
            "#d45f55",
            "#d45faa",
            "#d45fff",
            "#d47f00",
            "#d47f55",
            "#d47faa",
            "#d47fff",
            "#d49f00",
            "#d49f55",
            "#d49faa",
            "#d49fff",
            "#d4bf00",
            "#d4bf55",
            "#d4bfaa",
            "#d4bfff",
            "#d4df00",
            "#d4df55",
            "#d4dfaa",
            "#d4dfff",
            "#d4ff00",
            "#d4ff55",
            "#d4ffaa",
            "#d4ffff",
            "#ff0055",
            "#ff00aa",
            "#ff1f00",
            "#ff1f55",
            "#ff1faa",
            "#ff1fff",
            "#ff3f00",
            "#ff3f55",
            "#ff3faa",
            "#ff3fff",
            "#ff5f00",
            "#ff5f55",
            "#ff5faa",
            "#ff5fff",
            "#ff7f00",
            "#ff7f55",
            "#ff7faa",
            "#ff7fff",
            "#ff9f00",
            "#ff9f55",
            "#ff9faa",
            "#ff9fff",
            "#ffbf00",
            "#ffbf55",
            "#ffbfaa",
            "#ffbfff",
            "#ffdf00",
            "#ffdf55",
            "#ffdfaa",
            "#ffdfff",
            "#ffff55",
            "#ffffaa",
            "#ccccff",
            "#ffccff",
            "#33ffff",
            "#66ffff",
            "#99ffff",
            "#ccffff",
            "#007f00",
            "#007f55",
            "#007faa",
            "#007fff",
            "#009f00",
            "#009f55",
            "#009faa",
            "#009fff",
            "#00bf00",
            "#00bf55",
            "#00bfaa",
            "#00bfff",
            "#00df00",
            "#00df55",
            "#00dfaa",
            "#00dfff",
            "#00ff55",
            "#00ffaa",
            "#2a0000",
            "#2a0055",
            "#2a00aa",
            "#2a00ff",
            "#2a1f00",
            "#2a1f55",
            "#2a1faa",
            "#2a1fff",
            "#2a3f00",
            "#2a3f55",
            "#fffbf0",
            "#a0a0a4",
            "#808080",
            "#ff0000",
            "#00ff00",
            "#ffff00",
            "#0000ff",
            "#ff00ff",
            "#00ffff",
            "#ffffff"
        ];

        return colors[square];
    }

    /// @notice Given a bitmap and index, returns bits corresponding to the square at index.
    /// @param  bitmap 16 byte value containing all bitmap data.
    /// @param  index index of square being retrieved.
    /// @return square 8 bit uint denoting the color of the square.
    function _getSquareFromMap(bytes16 bitmap, uint256 index) internal pure returns (uint256 square) {
        assembly {
            let shift := sub(252, mul(index, 4))
            square := shr(shift, and(shl(shift, shr(0xFC, not(0))), bitmap))
        }
    }

    /// @notice Given a bitmap, returns corresponding svg string.
    /// @param  bitmap 16 byte value containing all bitmap data.
    /// @return svg string to display bitmap.
    function _renderSvg(bytes16 bitmap) internal pure returns (string memory) {
        string memory svgString = "<?xml version='1.0' encoding='UTF-8' standalone='no'?><svg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 8 8'>";

        uint256 y;
        for (uint i; i < 16; i += 4) {
            
            svgString = string(abi.encodePacked(
                svgString, 
                string(abi.encodePacked("<rect fill='", _getFillFromSquare(_getSquareFromMap(bitmap, i)), "' x='0' y='", _toString(y), "' width='1' height='1' />")),
                string(abi.encodePacked("<rect fill='", _getFillFromSquare(_getSquareFromMap(bitmap, i + 1)), "' x='1' y='", _toString(y), "' width='1' height='1' />")),
                string(abi.encodePacked("<rect fill='", _getFillFromSquare(_getSquareFromMap(bitmap, i + 2)), "' x='2' y='", _toString(y), "' width='1' height='1' />")),
                string(abi.encodePacked("<rect fill='", _getFillFromSquare(_getSquareFromMap(bitmap, i + 3)), "' x='3' y='", _toString(y), "' width='1' height='1' />"))
            ));

            unchecked {
                ++y;
            }
        }

        svgString = string(abi.encodePacked(svgString, "</svg>"));
        return svgString;
    }

    // SOURCE: https://etherscan.io/address/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63#code
    function _uintToHexDigit(uint8 d) internal pure returns (bytes1) {
        if (0 <= d && d <= 9) {
            return bytes1(uint8(bytes1("0")) + d);
        } else if (10 <= uint8(d) && uint8(d) <= 15) {
            return bytes1(uint8(bytes1("a")) + d - 10);
        }
        revert();
    }

    // SOURCE: https://etherscan.io/address/0x8d04a8c79ceb0889bdd12acdf3fa9d207ed3ff63#code
    function _uintToHexString(uint a) internal pure returns (string memory) {
        uint count = 0;
        uint b = a;
        while (b != 0) {
            count++;
            b /= 16;
        }
        bytes memory res = new bytes(count);
        for (uint i=0; i<count; ++i) {
            b = a % 16;
            res[count - i - 1] = _uintToHexDigit(uint8(b));
            a /= 16;
        }
        
        string memory str = string(res);
        if (bytes(str).length == 0) {
            return "00";
        } else if (bytes(str).length == 1) {
            return string(abi.encodePacked("0", str));
        }
        return str;
    }

    // SOURCE: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/3210a8653b66726114226ee5153bbcf59b0475bd/contracts/utils/Strings.sol#L16
    function _toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}