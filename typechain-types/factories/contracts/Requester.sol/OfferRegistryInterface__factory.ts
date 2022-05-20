/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  OfferRegistryInterface,
  OfferRegistryInterfaceInterface,
} from "../../../contracts/Requester.sol/OfferRegistryInterface";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "offerer",
        type: "address",
      },
      {
        internalType: "address",
        name: "offeree",
        type: "address",
      },
      {
        internalType: "string",
        name: "scriptIpfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxOfferValue",
        type: "uint256",
      },
    ],
    name: "registerOffer",
    outputs: [
      {
        internalType: "uint256",
        name: "registryNumber",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class OfferRegistryInterface__factory {
  static readonly abi = _abi;
  static createInterface(): OfferRegistryInterfaceInterface {
    return new utils.Interface(_abi) as OfferRegistryInterfaceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OfferRegistryInterface {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as OfferRegistryInterface;
  }
}
