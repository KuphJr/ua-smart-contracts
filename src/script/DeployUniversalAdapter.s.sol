// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {UniversalAdapter} from "../UniversalAdapter.sol";
import "chainlink/interfaces/LinkTokenInterface.sol";

contract DeployUniversalAdapter is Script {
    UniversalAdapter public adapter;
    LinkTokenInterface public linkToken;
    uint256 public numNodes;
    address[] public nodes;
    address[] collectors;

    function setUp() public {
        linkToken = LinkTokenInterface(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        numNodes = 16;
        _createNodes(numNodes);
    }

    function run() public {
        vm.broadcast();
        adapter = new UniversalAdapter(address(linkToken), nodes, collectors);
    }

    function _createNodes(uint256 num) internal {
        string[] memory inputs = new string[](1);
        inputs[0] = "src/script/createNode.sh";

        for(uint256 i; i < num; i++) {
            bytes memory res = vm.ffi(inputs);
            address output = abi.decode(res, (address));

            nodes.push(output);
            collectors.push(output);
        }
    }
}
