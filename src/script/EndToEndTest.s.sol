// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {AgreementRegistry} from "../AgreementRegistry.sol";
import {Agreement} from "../Agreement.sol";
import {IUniversalAdapter} from "../interfaces/IUniversalAdapter.sol";
import "chainlink/interfaces/LinkTokenInterface.sol";

contract CreateAgreement is Script {
    Agreement public agreement;
    AgreementRegistry public registry;
    address public redeemer;
    uint256 public maxPayout;
    IUniversalAdapter adapter;
    LinkTokenInterface linkToken;

    function setUp() public {
        linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        adapter = IUniversalAdapter(0xB7aB5555BB8927BF16F8496da338a3033c12F8f3);
        redeemer = 0x981FC7F035AD33181eD7604f0708c05674395574;
        maxPayout = 200;

        vm.startBroadcast();
        registry = new AgreementRegistry(linkToken, adapter, 100);
        linkToken.approve(address(registry), maxPayout);
        vm.stopBroadcast();
    }

    function run() public {
        vm.broadcast();
        agreement = registry.createAgreement(
            redeemer,
            block.timestamp + 10_000,
            true,
            maxPayout,
            abi.encode(
                "return BigInt(45)",
                "",
                "",
                "",
                ""
            )
        );
        vm.startBroadcast(redeemer);
        linkToken.approve(address(agreement), agreement.requestCost());
        agreement.redeem("", "");
        vm.stopBroadcast();
    }
}
