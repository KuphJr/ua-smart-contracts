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
        name: "tweetId",
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
  "0x60806040523480156200001157600080fd5b506040516200238e3803806200238e833981810160405281019062000037919062000304565b856000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816005908051906020019062000193929190620001b4565b504281620001a291906200041a565b600681905550505050505050620005e2565b828054620001c290620004eb565b90600052602060002090601f016020900481019282620001e6576000855562000232565b82601f106200020157805160ff191683800117855562000232565b8280016001018555821562000232579182015b828111156200023157825182559160200191906001019062000214565b5b50905062000241919062000245565b5090565b5b808211156200026057600081600090555060010162000246565b5090565b60006200027b6200027584620003e7565b620003b3565b9050828152602081018484840111156200029457600080fd5b620002a1848285620004b5565b509392505050565b600081519050620002ba81620005ae565b92915050565b600082601f830112620002d257600080fd5b8151620002e484826020860162000264565b91505092915050565b600081519050620002fe81620005c8565b92915050565b60008060008060008060c087890312156200031e57600080fd5b60006200032e89828a01620002a9565b96505060206200034189828a01620002a9565b95505060406200035489828a01620002a9565b94505060606200036789828a01620002a9565b935050608087015167ffffffffffffffff8111156200038557600080fd5b6200039389828a01620002c0565b92505060a0620003a689828a01620002ed565b9150509295509295509295565b6000604051905081810181811067ffffffffffffffff82111715620003dd57620003dc6200057f565b5b8060405250919050565b600067ffffffffffffffff8211156200040557620004046200057f565b5b601f19601f8301169050602081019050919050565b60006200042782620004ab565b91506200043483620004ab565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156200046c576200046b62000521565b5b828201905092915050565b600062000484826200048b565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015620004d5578082015181840152602081019050620004b8565b83811115620004e5576000848401525b50505050565b600060028204905060018216806200050457607f821691505b602082108114156200051b576200051a62000550565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620005b98162000477565b8114620005c557600080fd5b50565b620005d381620004ab565b8114620005df57600080fd5b50565b611d9c80620005f26000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c8063c078c33a11610097578063da284dcc11610066578063da284dcc1461022e578063e49396501461024c578063fa92202c14610268578063ff43221c14610284576100f5565b8063c078c33a146101b8578063c782ff1f146101d4578063cfd1a7e2146101f2578063d1f807d814610210576100f5565b80635f898d59116100d35780635f898d591461015457806381a0f4d914610172578063acceba7714610190578063b79550be146101ae576100f5565b80631865c57d146100fa57806328c1f99b14610118578063385a9c3714610136575b600080fd5b6101026102a2565b60405161010f91906119cc565b60405180910390f35b610120610341565b60405161012d9190611a1d565b60405180910390f35b61013e610367565b60405161014b91906119b1565b60405180910390f35b61015c61037a565b6040516101699190611789565b60405180910390f35b61017a6103a0565b6040516101879190611a38565b60405180910390f35b61019861042e565b6040516101a59190611a02565b60405180910390f35b6101b6610452565b005b6101d260048036038101906101cd91906112b7565b6106a2565b005b6101dc610a37565b6040516101e99190611789565b60405180910390f35b6101fa610a5d565b6040516102079190611afa565b60405180910390f35b610218610a63565b6040516102259190611afa565b60405180910390f35b610236610a69565b6040516102439190611afa565b60405180910390f35b6102666004803603810190610261919061137e565b610a6f565b005b610282600480360381019061027d919061132c565b610f7c565b005b61028c6111df565b60405161029991906119e7565b60405180910390f35b600060011515600860009054906101000a900460ff16151514156102e8577f66756c66696c6c65640000000000000000000000000000000000000000000000905061033e565b60065442111561031a577f6578706972656400000000000000000000000000000000000000000000000000905061033e565b7f70656e64696e670000000000000000000000000000000000000000000000000090505b90565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600860009054906101000a900460ff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600580546103ad90611cc6565b80601f01602080910402602001604051908101604052809291908181526020018280546103d990611cc6565b80156104265780601f106103fb57610100808354040283529160200191610426565b820191906000526020600020905b81548152906001019060200180831161040957829003601f168201915b505050505081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146104e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d990611a9a565b60405180910390fd5b6006544211610526576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161051d90611aba565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd30600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016105df9190611789565b60206040518083038186803b1580156105f757600080fd5b505afa15801561060b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062f9190611355565b6040518463ffffffff1660e01b815260040161064d93929190611827565b602060405180830381600087803b15801561066757600080fd5b505af115801561067b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061069f919061128e565b50565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610732576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161072990611a7a565b60405180910390fd5b6006544210610776576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161076d90611a5a565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd333060646040518463ffffffff1660e01b81526004016107d4939291906117a4565b602060405180830381600087803b1580156107ee57600080fd5b505af1158015610802573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610826919061128e565b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660646040518363ffffffff1660e01b81526004016108a592919061195f565b602060405180830381600087803b1580156108bf57600080fd5b505af11580156108d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108f7919061128e565b506000848484846040516020016109119493929190611740565b6040516020818303038152906040529050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ccc57b603063e493965060e01b6005856040518563ffffffff1660e01b815260040161098b949392919061185e565b602060405180830381600087803b1580156109a557600080fd5b505af11580156109b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109dd9190611355565b6009819055507f3f3d9555929bdbb58a08e996fe238aab344c384eb8c1ea96d0385c2eef7de1143063e493965060e01b600584600754600954604051610a28969594939291906118d0565b60405180910390a15050505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60095481565b60075481565b60065481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610aff576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610af690611ada565b60405180910390fd5b600654421115610b4b577f43f226e615344846b5633fbef329535f8ea46f8f5873f91afdc24f399876d40c8160075484604051610b3e93929190611b15565b60405180910390a1610f78565b6001600860006101000a81548160ff02191690831515021790555060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610bc29190611789565b60206040518083038186803b158015610bda57600080fd5b505afa158015610bee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c129190611355565b9050818111610cf05760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16836040518363ffffffff1660e01b8152600401610c98929190611988565b602060405180830381600087803b158015610cb257600080fd5b505af1158015610cc6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cea919061128e565b50610f39565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16846040518363ffffffff1660e01b8152600401610d6d929190611988565b602060405180830381600087803b158015610d8757600080fd5b505af1158015610d9b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610dbf919061128e565b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610e789190611789565b60206040518083038186803b158015610e9057600080fd5b505afa158015610ea4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ec89190611355565b6040518363ffffffff1660e01b8152600401610ee5929190611988565b602060405180830381600087803b158015610eff57600080fd5b505af1158015610f13573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f37919061128e565b505b7fea45de839b1699fcf9500fd297def547a4aa9c63a36e2213964c242c94e47bea8260075485604051610f6e93929190611b15565b60405180910390a1505b5050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461100c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161100390611a9a565b60405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1630846040518463ffffffff1660e01b815260040161108b93929190611827565b602060405180830381600087803b1580156110a557600080fd5b505af11580156110b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110dd919061128e565b50600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632273ae52600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166005856040518563ffffffff1660e01b815260040161118494939291906117db565b602060405180830381600087803b15801561119e57600080fd5b505af11580156111b2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111d69190611355565b60078190555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008151905061121481611d38565b92915050565b60008083601f84011261122c57600080fd5b8235905067ffffffffffffffff81111561124557600080fd5b60208301915083600182028301111561125d57600080fd5b9250929050565b60008135905061127381611d4f565b92915050565b60008151905061128881611d4f565b92915050565b6000602082840312156112a057600080fd5b60006112ae84828501611205565b91505092915050565b600080600080604085870312156112cd57600080fd5b600085013567ffffffffffffffff8111156112e757600080fd5b6112f38782880161121a565b9450945050602085013567ffffffffffffffff81111561131257600080fd5b61131e8782880161121a565b925092505092959194509250565b60006020828403121561133e57600080fd5b600061134c84828501611264565b91505092915050565b60006020828403121561136757600080fd5b600061137584828501611279565b91505092915050565b6000806040838503121561139157600080fd5b600061139f85828601611264565b92505060206113b085828601611264565b9150509250929050565b6113c381611b88565b82525050565b6113d281611b9a565b82525050565b6113e181611ba6565b82525050565b6113f081611bb0565b82525050565b6113ff81611c06565b82525050565b61140e81611c2a565b82525050565b61141d81611c4e565b82525050565b61142c81611c72565b82525050565b600061143e8385611b7d565b935061144b838584611c84565b82840190509392505050565b600061146282611b61565b61146c8185611b6c565b935061147c818560208601611c93565b61148581611d27565b840191505092915050565b6000815461149d81611cc6565b6114a78186611b6c565b945060018216600081146114c257600181146114d457611507565b60ff1983168652602086019350611507565b6114dd85611b4c565b60005b838110156114ff578154818901526001820191506020810190506114e0565b808801955050505b50505092915050565b600061151d600d83611b6c565b91507f4f666665722065787069726564000000000000000000000000000000000000006000830152602082019050919050565b600061155d600c83611b6c565b91507f4f6e6c79206f66666572656500000000000000000000000000000000000000006000830152602082019050919050565b600061159d600c83611b7d565b91507f222c226170694b6579223a2200000000000000000000000000000000000000006000830152600c82019050919050565b60006115dd600c83611b6c565b91507f4f6e6c79206f66666572657200000000000000000000000000000000000000006000830152602082019050919050565b600061161d600c83611b7d565b91507f7b2274776565744964223a2200000000000000000000000000000000000000006000830152600c82019050919050565b600061165d600283611b7d565b91507f227d0000000000000000000000000000000000000000000000000000000000006000830152600282019050919050565b600061169d601183611b6c565b91507f4f66666572206e6f7420657870697265640000000000000000000000000000006000830152602082019050919050565b60006116dd600e83611b6c565b91507f4e6f742061676772656761746f720000000000000000000000000000000000006000830152602082019050919050565b6000815250565b6000611724600083611b6c565b9150600082019050919050565b61173a81611bfc565b82525050565b600061174b82611610565b9150611758828688611432565b915061176382611590565b9150611770828486611432565b915061177b82611650565b915081905095945050505050565b600060208201905061179e60008301846113ba565b92915050565b60006060820190506117b960008301866113ba565b6117c660208301856113ba565b6117d36040830184611423565b949350505050565b60006080820190506117f060008301876113ba565b6117fd60208301866113ba565b818103604083015261180f8185611490565b905061181e6060830184611731565b95945050505050565b600060608201905061183c60008301866113ba565b61184960208301856113ba565b6118566040830184611731565b949350505050565b600060c08201905061187360008301876113ba565b61188060208301866113e7565b818103604083015261189181611717565b905081810360608301526118a58185611490565b905081810360808301526118b98184611457565b90506118c760a08301611710565b95945050505050565b6000610100820190506118e660008301896113ba565b6118f360208301886113e7565b818103604083015261190481611717565b905081810360608301526119188187611490565b9050818103608083015261192c8186611457565b905061193a60a08301611710565b61194760c0830185611731565b61195460e0830184611731565b979650505050505050565b600060408201905061197460008301856113ba565b6119816020830184611423565b9392505050565b600060408201905061199d60008301856113ba565b6119aa6020830184611731565b9392505050565b60006020820190506119c660008301846113c9565b92915050565b60006020820190506119e160008301846113d8565b92915050565b60006020820190506119fc60008301846113f6565b92915050565b6000602082019050611a176000830184611405565b92915050565b6000602082019050611a326000830184611414565b92915050565b60006020820190508181036000830152611a528184611457565b905092915050565b60006020820190508181036000830152611a7381611510565b9050919050565b60006020820190508181036000830152611a9381611550565b9050919050565b60006020820190508181036000830152611ab3816115d0565b9050919050565b60006020820190508181036000830152611ad381611690565b9050919050565b60006020820190508181036000830152611af3816116d0565b9050919050565b6000602082019050611b0f6000830184611731565b92915050565b6000606082019050611b2a6000830186611731565b611b376020830185611731565b611b446040830184611731565b949350505050565b60008190508160005260206000209050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000611b9382611bdc565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000611c1182611c18565b9050919050565b6000611c2382611bdc565b9050919050565b6000611c3582611c3c565b9050919050565b6000611c4782611bdc565b9050919050565b6000611c5982611c60565b9050919050565b6000611c6b82611bdc565b9050919050565b6000611c7d82611bfc565b9050919050565b82818337600083830152505050565b60005b83811015611cb1578082015181840152602081019050611c96565b83811115611cc0576000848401525b50505050565b60006002820490506001821680611cde57607f821691505b60208210811415611cf257611cf1611cf8565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b611d4181611b9a565b8114611d4c57600080fd5b50565b611d5881611bfc565b8114611d6357600080fd5b5056fea2646970667358221220f259899a8ac8b4f88c0e3216285e3975ec3ee73fec38f801bb740f0105a4ecf964736f6c63430008000033";

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
