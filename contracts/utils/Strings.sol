// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Strings {
    /// @dev Converts a uint256 to its ASCII string decimal representation.
    function toString(uint256 i) internal pure returns (string memory) {
        if (i == 0) {
            return "0";
        }
        uint256 j = i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory s = new bytes(len);
        while (i != 0) {
            len -= 1;
            s[len] = bytes1(uint8(48 + uint256(i % 10)));
            i /= 10;
        }
        return string(s);
    }

    /// @dev Converts an address to its ASCII string representation.
    function toString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) >> (8 * (19 - i))));
            bytes1 hi = bytes1(uint8(b) >> 4);
            bytes1 lo = bytes1(uint8(b) & 0xf);
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        c = uint8(b) < 10 ? bytes1(uint8(b) + 0x30) : bytes1(uint8(b) + 0x57);
    }

    function substring(
        string memory str,
        uint256 startIndex,
        uint256 length
    ) internal pure returns (string memory) {
        bytes memory b = bytes(str);
        bytes memory s = new bytes(length);
        for (; length > 0;) {
            --length;
            s[length] = b[startIndex + length];
        }
        return string(s);
    }
}