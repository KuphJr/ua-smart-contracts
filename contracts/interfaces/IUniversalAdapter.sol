// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniversalAdapter {
  struct PublicVars {
    string[] keys;
    string[] values;
  }

  struct EncryptedPrivateVars {
    string[] keys;
    // NOTE: this number must be changed for the number of nodes in the Universal Adapter DON
    bytes[5][] encryptedValuesByNodeId;
  }
  
  function makeRequest(
    bytes4 callbackFunctionId,
    string memory source,
    bytes32 sourceHash,
    PublicVars memory publicVars,
    EncryptedPrivateVars memory privateVars
  ) external returns (uint requestId);
}