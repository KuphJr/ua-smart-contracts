// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {AgreementRegistry} from "../AgreementRegistry.sol";
import {Agreement} from "../Agreement.sol";
import {IUniversalAdapter} from "../interfaces/IUniversalAdapter.sol";
import "chainlink/interfaces/LinkTokenInterface.sol";

contract RedeemAgreement is Script {
    Agreement public agreement;
    AgreementRegistry public registry;
    LinkTokenInterface linkToken;

    function setUp() public {
        linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        agreement = Agreement(/* TODO address */);

        vm.broadcast();
        linkToken.approve(address(agreement), agreement.requestCost());
    }

    function run() public {
        vm.broadcast();
        agreement.makeRequest("", "");
    }
}
