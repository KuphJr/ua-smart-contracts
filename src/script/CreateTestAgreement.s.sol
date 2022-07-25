// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {AgreementRegistry} from "../AgreementRegistry.sol";
import {Agreement} from "../Agreement.sol";
import {IUniversalAdapter} from "../interfaces/IUniversalAdapter.sol";
import "chainlink/interfaces/LinkTokenInterface.sol";
import {MockLinkToken} from "../test/mocks/MockLinkToken.sol";

contract CreateTestAgreement is Script {
    AgreementRegistry registry;
    Agreement agreement;
    LinkTokenInterface linkToken;

    function setUp() public {
        vm.startBroadcast();
        MockLinkToken mockLinkToken = new MockLinkToken();
        linkToken = LinkTokenInterface(address(mockLinkToken));
        registry = new AgreementRegistry(LinkTokenInterface(linkToken), IUniversalAdapter(address(1337)), 100);
        linkToken.approve(address(registry), type(uint256).max);
        vm.stopBroadcast();
    }

    function run() public {
        vm.broadcast();
        agreement = registry.createAgreement(address(0xb0b), block.timestamp + 10_000, true, 100, abi.encode("", "", "", "", ""));
        console.log(address(agreement));
        console.log(registry.tokenURI(0));
    }
}
