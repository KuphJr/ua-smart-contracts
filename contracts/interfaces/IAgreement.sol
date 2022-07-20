// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IAgreement {
    function makeRequest(
        string calldata _vars
    ) external returns (bytes32);

    function fulfillRequest(bytes32 requestId, bytes32 _result) external;
}