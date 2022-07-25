// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;

// import "forge-std/Script.sol";
// import {Agreement} from "../Agreement.sol";
// import {AgreementRegistry} from "../AgreementRegistry.sol";
// import {UniversalAdapter} from "../UniversalAdapter.sol";
// import {DeployUniversalAdapter} from "./DeployUniversalAdapter.s.sol";
// import {CreateAgreement} from "./CreateAgreement.s.sol";
// import "chainlink/interfaces/LinkTokenInterface.sol";

// contract UniversalAdapterTest is Script {
//     bytes32 constant HASHED_RESPONSE_JOBSPEC =
//         0x3133346463393332346463643465633061383131363162356131363730323432;
//     bytes32 constant UNHASHED_RESPONSE_JOBSPEC =
//         0x6339336337646136616536303432363762653736663136353837306431326230;

//     event OracleRequest(
//         bytes32 indexed specId,
//         address requester,
//         bytes32 requestId,
//         uint256 payment,
//         address callbackAddr,
//         bytes4 callbackFunctionId,
//         uint256 cancelExpiration,
//         uint256 dataVersion,
//         bytes data
//     );

//     UniversalAdapter adapter;
//     AgreementRegistry registry;
//     Agreement agreement;
//     DeployUniversalAdapter deployAdapter;
//     CreateAgreement createAgreement;
//     LinkTokenInterface linkToken;

//     function setUp() public {
//         deployAdapter = new DeployUniversalAdapter();
//         deployAdapter.setUp();
//         deployAdapter.run();
//         adapter = deployAdapter.adapter();
//         linkToken = deployAdapter.linkToken();

//         createAgreement = new CreateAgreement();
//         createAgreement.setUp();
//         createAgreement.run();
//         registry = createAgreement.registry();
//         agreement = createAgreement.agreement();

//         vm.broadcast();
//         linkToken.approve(address(registry), type(uint256).max);
//     }

//     function run() public {
//         vm.broadcast();
//         vm.expectEmit(true, false, false, true, address(adapter));
//         emit OracleRequest(
//             HASHED_RESPONSE_JOBSPEC, address(adapter), bytes32(uint256(1)), 0,
//             address(adapter), agreement.fulfillRequest.selector,
//             block.timestamp + 10_000, 1, ""
//         );
//         bytes32 reqId = agreement.makeRequest("", "");
//         for (uint256 i = 0; i < deployAdapter.numNodes(); i++) {
//             vm.broadcast(deployAdapter.nodes(i));
//             adapter.respondWithHashedAnswer(
//                 reqId,
//                 bytes8(keccak256(abi.encodePacked(uint256(45))))
//             );
//         }
//         // agreement.fulfillRequest(reqId, bytes32(uint256(45)));
//     }
// }
