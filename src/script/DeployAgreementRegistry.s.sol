// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {AgreementRegistry} from "../AgreementRegistry.sol";
import {IUniversalAdapter} from "../interfaces/IUniversalAdapter.sol";
import "chainlink/interfaces/LinkTokenInterface.sol";

contract DeployAgreementRegistry is Script {
    AgreementRegistry registry;
    IUniversalAdapter adapter;
    LinkTokenInterface linkToken;

    function setUp() public {
        linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        adapter = IUniversalAdapter(0xB7aB5555BB8927BF16F8496da338a3033c12F8f3);
    }

    function run() public {
        vm.broadcast();
        registry = new AgreementRegistry(linkToken, adapter);
    }
}
