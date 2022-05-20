/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  Requester,
  RequesterInterface,
} from "../../../contracts/Requester.sol/Requester";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_link",
        type: "address",
      },
      {
        internalType: "address",
        name: "_aggregator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_registry",
        type: "address",
      },
      {
        internalType: "address",
        name: "_offeree",
        type: "address",
      },
      {
        internalType: "string",
        name: "_scriptIpfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "expiration",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "expiredPaymentAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "registryIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestNumber",
        type: "uint256",
      },
    ],
    name: "ExpiredOfferFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "registryIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestNumber",
        type: "uint256",
      },
    ],
    name: "OfferFulfilled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "callbackAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes4",
        name: "callbackFunctionId",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "string",
        name: "js",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "vars",
        type: "string",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "ref",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "registryIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestNumber",
        type: "uint256",
      },
    ],
    name: "RequestSent",
    type: "event",
  },
  {
    inputs: [],
    name: "aggregatorContract",
    outputs: [
      {
        internalType: "contract DirectRequestAggregatorInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "expirationTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountOwed",
        type: "uint256",
      },
    ],
    name: "fulfillDirectRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "url",
        type: "string",
      },
      {
        internalType: "string",
        name: "apiKey",
        type: "string",
      },
    ],
    name: "fulfillOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getState",
    outputs: [
      {
        internalType: "bytes32",
        name: "state",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "maxOfferValue",
        type: "uint256",
      },
    ],
    name: "initalizeOffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "isFulfilled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "linkTokenContract",
    outputs: [
      {
        internalType: "contract LinkTokenInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "offeree",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "offerer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recoverFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "registryContract",
    outputs: [
      {
        internalType: "contract OfferRegistryInterface",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registryIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "requestNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "scriptIpfsHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200223338038062002233833981810160405281019062000037919062000304565b856000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816005908051906020019062000193929190620001b4565b504281620001a291906200041a565b600681905550505050505050620005e2565b828054620001c290620004eb565b90600052602060002090601f016020900481019282620001e6576000855562000232565b82601f106200020157805160ff191683800117855562000232565b8280016001018555821562000232579182015b828111156200023157825182559160200191906001019062000214565b5b50905062000241919062000245565b5090565b5b808211156200026057600081600090555060010162000246565b5090565b60006200027b6200027584620003e7565b620003b3565b9050828152602081018484840111156200029457600080fd5b620002a1848285620004b5565b509392505050565b600081519050620002ba81620005ae565b92915050565b600082601f830112620002d257600080fd5b8151620002e484826020860162000264565b91505092915050565b600081519050620002fe81620005c8565b92915050565b60008060008060008060c087890312156200031e57600080fd5b60006200032e89828a01620002a9565b96505060206200034189828a01620002a9565b95505060406200035489828a01620002a9565b94505060606200036789828a01620002a9565b935050608087015167ffffffffffffffff8111156200038557600080fd5b6200039389828a01620002c0565b92505060a0620003a689828a01620002ed565b9150509295509295509295565b6000604051905081810181811067ffffffffffffffff82111715620003dd57620003dc6200057f565b5b8060405250919050565b600067ffffffffffffffff8211156200040557620004046200057f565b5b601f19601f8301169050602081019050919050565b60006200042782620004ab565b91506200043483620004ab565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200046c576200046b62000521565b5b828201905092915050565b600062000484826200048b565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015620004d5578082015181840152602081019050620004b8565b83811115620004e5576000848401525b50505050565b600060028204905060018216806200050457607f821691505b602082108114156200051b576200051a62000550565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620005b98162000477565b8114620005c557600080fd5b50565b620005d381620004ab565b8114620005df57600080fd5b50565b611c4180620005f26000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063c078c33a11610097578063da284dcc11610066578063da284dcc1461022e578063e49396501461024c578063fa92202c14610268578063ff43221c14610284576100f5565b8063c078c33a146101b8578063c782ff1f146101d4578063cfd1a7e2146101f2578063d1f807d814610210576100f5565b80635f898d59116100d35780635f898d591461015457806381a0f4d914610172578063acceba7714610190578063b79550be146101ae576100f5565b80631865c57d146100fa57806328c1f99b14610118578063385a9c3714610136575b600080fd5b6101026102a2565b60405161010f919061188b565b60405180910390f35b610120610341565b60405161012d91906118dc565b60405180910390f35b61013e610367565b60405161014b9190611870565b60405180910390f35b61015c61037a565b6040516101699190611671565b60405180910390f35b61017a6103a0565b60405161018791906118f7565b60405180910390f35b61019861042e565b6040516101a591906118c1565b60405180910390f35b6101b6610452565b005b6101d260048036038101906101cd91906112cd565b6106a2565b005b6101dc610a47565b6040516101e99190611671565b60405180910390f35b6101fa610a6d565b60405161020791906119b9565b60405180910390f35b610218610a73565b60405161022591906119b9565b60405180910390f35b610236610a79565b60405161024391906119b9565b60405180910390f35b61026660048036038101906102619190611394565b610a7f565b005b610282600480360381019061027d9190611342565b610f92565b005b61028c6111f5565b60405161029991906118a6565b60405180910390f35b600060011515600860009054906101000a900460ff16151514156102e8577f66756c66696c6c65640000000000000000000000000000000000000000000000905061033e565b60065442111561031a577f6578706972656400000000000000000000000000000000000000000000000000905061033e565b7f70656e64696e670000000000000000000000000000000000000000000000000090505b90565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600860009054906101000a900460ff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600580546103ad90611b6b565b80601f01602080910402602001604051908101604052809291908181526020018280546103d990611b6b565b80156104265780601f106103fb57610100808354040283529160200191610426565b820191906000526020600020905b81548152906001019060200180831161040957829003601f168201915b505050505081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d990611959565b60405180910390fd5b6006544211610526576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161051d90611979565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd30600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016105df9190611671565b60206040518083038186803b1580156105f757600080fd5b505afa15801561060b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062f919061136b565b6040518463ffffffff1660e01b815260040161064d9392919061170f565b602060405180830381600087803b15801561066757600080fd5b505af115801561067b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061069f91906112a4565b50565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610732576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161072990611939565b60405180910390fd5b6006544210610776576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161076d90611919565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd333060646040518463ffffffff1660e01b81526004016107d49392919061168c565b602060405180830381600087803b1580156107ee57600080fd5b505af1158015610802573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061082691906112a4565b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660646040518363ffffffff1660e01b81526004016108a5929190611847565b602060405180830381600087803b1580156108bf57600080fd5b505af11580156108d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f791906112a4565b5060006040518060400160405280600781526020017f7b2262223a357d000000000000000000000000000000000000000000000000008152509050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ccc57b603063e493965060e01b6005856040518563ffffffff1660e01b815260040161099b9493929190611746565b602060405180830381600087803b1580156109b557600080fd5b505af11580156109c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109ed919061136b565b6009819055507f3f3d9555929bdbb58a08e996fe238aab344c384eb8c1ea96d0385c2eef7de1143063e493965060e01b600584600754600954604051610a38969594939291906117b8565b60405180910390a15050505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60095481565b60075481565b60065481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b0f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0690611999565b60405180910390fd5b600654421115610b5b577f43f226e615344846b5633fbef329535f8ea46f8f5873f91afdc24f399876d40c8160075484604051610b4e939291906119d4565b60405180910390a1610f8e565b6001600860006101000a81548160ff02191690831515021790555060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610bd29190611671565b60206040518083038186803b158015610bea57600080fd5b505afa158015610bfe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c22919061136b565b9050818111610d035760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd30600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040518463ffffffff1660e01b8152600401610caa9392919061170f565b602060405180830381600087803b158015610cc457600080fd5b505af1158015610cd8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cfc91906112a4565b5050610f8e565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd30600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16856040518463ffffffff1660e01b8152600401610d829392919061170f565b602060405180830381600087803b158015610d9c57600080fd5b505af1158015610db0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dd491906112a4565b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd30600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610e8e9190611671565b60206040518083038186803b158015610ea657600080fd5b505afa158015610eba573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ede919061136b565b6040518463ffffffff1660e01b8152600401610efc9392919061170f565b602060405180830381600087803b158015610f1657600080fd5b505af1158015610f2a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f4e91906112a4565b507fea45de839b1699fcf9500fd297def547a4aa9c63a36e2213964c242c94e47bea8260075485604051610f84939291906119d4565b60405180910390a1505b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611022576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161101990611959565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1630846040518463ffffffff1660e01b81526004016110a19392919061170f565b602060405180830381600087803b1580156110bb57600080fd5b505af11580156110cf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110f391906112a4565b50600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632273ae52600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166005856040518563ffffffff1660e01b815260040161119a94939291906116c3565b602060405180830381600087803b1580156111b457600080fd5b505af11580156111c8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111ec919061136b565b60078190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008151905061122a81611bdd565b92915050565b60008083601f84011261124257600080fd5b8235905067ffffffffffffffff81111561125b57600080fd5b60208301915083600182028301111561127357600080fd5b9250929050565b60008135905061128981611bf4565b92915050565b60008151905061129e81611bf4565b92915050565b6000602082840312156112b657600080fd5b60006112c48482850161121b565b91505092915050565b600080600080604085870312156112e357600080fd5b600085013567ffffffffffffffff8111156112fd57600080fd5b61130987828801611230565b9450945050602085013567ffffffffffffffff81111561132857600080fd5b61133487828801611230565b925092505092959194509250565b60006020828403121561135457600080fd5b60006113628482850161127a565b91505092915050565b60006020828403121561137d57600080fd5b600061138b8482850161128f565b91505092915050565b600080604083850312156113a757600080fd5b60006113b58582860161127a565b92505060206113c68582860161127a565b9150509250929050565b6113d981611a3c565b82525050565b6113e881611a4e565b82525050565b6113f781611a5a565b82525050565b61140681611a64565b82525050565b61141581611aba565b82525050565b61142481611ade565b82525050565b61143381611b02565b82525050565b61144281611b26565b82525050565b600061145382611a20565b61145d8185611a2b565b935061146d818560208601611b38565b61147681611bcc565b840191505092915050565b6000815461148e81611b6b565b6114988186611a2b565b945060018216600081146114b357600181146114c5576114f8565b60ff19831686526020860193506114f8565b6114ce85611a0b565b60005b838110156114f0578154818901526001820191506020810190506114d1565b808801955050505b50505092915050565b600061150e600d83611a2b565b91507f4f666665722065787069726564000000000000000000000000000000000000006000830152602082019050919050565b600061154e600c83611a2b565b91507f4f6e6c79206f66666572656500000000000000000000000000000000000000006000830152602082019050919050565b600061158e600c83611a2b565b91507f4f6e6c79206f66666572657200000000000000000000000000000000000000006000830152602082019050919050565b60006115ce601183611a2b565b91507f4f66666572206e6f7420657870697265640000000000000000000000000000006000830152602082019050919050565b600061160e600e83611a2b565b91507f4e6f742061676772656761746f720000000000000000000000000000000000006000830152602082019050919050565b6000815250565b6000611655600083611a2b565b9150600082019050919050565b61166b81611ab0565b82525050565b600060208201905061168660008301846113d0565b92915050565b60006060820190506116a160008301866113d0565b6116ae60208301856113d0565b6116bb6040830184611439565b949350505050565b60006080820190506116d860008301876113d0565b6116e560208301866113d0565b81810360408301526116f78185611481565b90506117066060830184611662565b95945050505050565b600060608201905061172460008301866113d0565b61173160208301856113d0565b61173e6040830184611662565b949350505050565b600060c08201905061175b60008301876113d0565b61176860208301866113fd565b818103604083015261177981611648565b9050818103606083015261178d8185611481565b905081810360808301526117a18184611448565b90506117af60a08301611641565b95945050505050565b6000610100820190506117ce60008301896113d0565b6117db60208301886113fd565b81810360408301526117ec81611648565b905081810360608301526118008187611481565b905081810360808301526118148186611448565b905061182260a08301611641565b61182f60c0830185611662565b61183c60e0830184611662565b979650505050505050565b600060408201905061185c60008301856113d0565b6118696020830184611439565b9392505050565b600060208201905061188560008301846113df565b92915050565b60006020820190506118a060008301846113ee565b92915050565b60006020820190506118bb600083018461140c565b92915050565b60006020820190506118d6600083018461141b565b92915050565b60006020820190506118f1600083018461142a565b92915050565b600060208201905081810360008301526119118184611448565b905092915050565b6000602082019050818103600083015261193281611501565b9050919050565b6000602082019050818103600083015261195281611541565b9050919050565b6000602082019050818103600083015261197281611581565b9050919050565b60006020820190508181036000830152611992816115c1565b9050919050565b600060208201905081810360008301526119b281611601565b9050919050565b60006020820190506119ce6000830184611662565b92915050565b60006060820190506119e96000830186611662565b6119f66020830185611662565b611a036040830184611662565b949350505050565b60008190508160005260206000209050919050565b600081519050919050565b600082825260208201905092915050565b6000611a4782611a90565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000611ac582611acc565b9050919050565b6000611ad782611a90565b9050919050565b6000611ae982611af0565b9050919050565b6000611afb82611a90565b9050919050565b6000611b0d82611b14565b9050919050565b6000611b1f82611a90565b9050919050565b6000611b3182611ab0565b9050919050565b60005b83811015611b56578082015181840152602081019050611b3b565b83811115611b65576000848401525b50505050565b60006002820490506001821680611b8357607f821691505b60208210811415611b9757611b96611b9d565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b611be681611a4e565b8114611bf157600080fd5b50565b611bfd81611ab0565b8114611c0857600080fd5b5056fea2646970667358221220882bc66239d6eeb571736a58dd282c04180bba1d95c7d67061a6680e58dbddd464736f6c63430008000033";

type RequesterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RequesterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Requester__factory extends ContractFactory {
  constructor(...args: RequesterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _link: string,
    _aggregator: string,
    _registry: string,
    _offeree: string,
    _scriptIpfsHash: string,
    expiration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Requester> {
    return super.deploy(
      _link,
      _aggregator,
      _registry,
      _offeree,
      _scriptIpfsHash,
      expiration,
      overrides || {}
    ) as Promise<Requester>;
  }
  override getDeployTransaction(
    _link: string,
    _aggregator: string,
    _registry: string,
    _offeree: string,
    _scriptIpfsHash: string,
    expiration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _link,
      _aggregator,
      _registry,
      _offeree,
      _scriptIpfsHash,
      expiration,
      overrides || {}
    );
  }
  override attach(address: string): Requester {
    return super.attach(address) as Requester;
  }
  override connect(signer: Signer): Requester__factory {
    return super.connect(signer) as Requester__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RequesterInterface {
    return new utils.Interface(_abi) as RequesterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Requester {
    return new Contract(address, _abi, signerOrProvider) as Requester;
  }
}
