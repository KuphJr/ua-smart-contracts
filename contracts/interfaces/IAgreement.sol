// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAgreement {
    function redeem(
        string calldata _vars,
        string calldata ref
    ) external returns (bytes32);

    function fulfillRequest(bytes32 requestId, bytes32 _result) external;
}