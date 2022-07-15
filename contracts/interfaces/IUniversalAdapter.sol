// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniversalAdapter {
  function makeRequest(
    string calldata js,
    string calldata cid,
    string calldata vars,
    string calldata ref
  ) external returns (bytes32 requestId);
}