// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import {ERC20} from "@solmate/tokens/ERC20.sol";

contract MockLinkToken is ERC20 {
  constructor() ERC20("ChainLink Token", "LINK", 18) {
      _mint(msg.sender, 10**27);
  }
}
