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
  ExampleRequester,
  ExampleRequesterInterface,
} from "../../../contracts/ExampleRequester.sol/ExampleRequester";

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
        internalType: "uint256",
        name: "_requestCost",
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
        internalType: "bytes32",
        name: "result",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "requestNumber",
        type: "uint256",
      },
    ],
    name: "RequestFulfilled",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_requestNumber",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_result",
        type: "bytes32",
      },
    ],
    name: "fulfillDirectRequest",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "string",
        name: "js",
        type: "string",
      },
      {
        internalType: "string",
        name: "cid",
        type: "string",
      },
      {
        internalType: "string",
        name: "vars",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "ref",
        type: "bytes32",
      },
    ],
    name: "makeRequest",
    outputs: [
      {
        internalType: "uint256",
        name: "requestNumber",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "result",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000dd038038062000dd08339818101604052810190620000379190620000f6565b826000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600381905550505050620001be565b600081519050620000d9816200018a565b92915050565b600081519050620000f081620001a4565b92915050565b6000806000606084860312156200010c57600080fd5b60006200011c86828701620000c8565b93505060206200012f86828701620000c8565b92505060406200014286828701620000df565b9150509250925092565b6000620001598262000160565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b62000195816200014c565b8114620001a157600080fd5b50565b620001af8162000180565b8114620001bb57600080fd5b50565b610c0280620001ce6000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80635dd62b5f1461005c5780636537214714610078578063acceba7714610096578063f4760259146100b4578063ff43221c146100e4575b600080fd5b610076600480360381019061007191906106d6565b610102565b005b6100806101d6565b60405161008d91906108fb565b60405180910390f35b61009e6101dc565b6040516100ab919061095a565b60405180910390f35b6100ce60048036038101906100c991906105fa565b610200565b6040516100db9190610995565b60405180910390f35b6100ec6104a5565b6040516100f9919061093f565b60405180910390f35b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610192576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161018990610975565b60405180910390fd5b806002819055507f1ca8663227a7fe9919713a01d344afbb434e234f35a3e540a6ad924f88771f3881836040516101ca929190610916565b60405180910390a15050565b60025481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd333060646040518463ffffffff1660e01b815260040161026193929190610821565b602060405180830381600087803b15801561027b57600080fd5b505af115801561028f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102b391906105d1565b5060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b3600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660646040518363ffffffff1660e01b81526004016103329291906108d2565b602060405180830381600087803b15801561034c57600080fd5b505af1158015610360573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061038491906105d1565b506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ccc57b6030635dd62b5f60e01b8b8b8b8b8b8b6040518963ffffffff1660e01b81526004016103f7989796959493929190610858565b602060405180830381600087803b15801561041157600080fd5b505af1158015610425573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061044991906106ad565b90507f608970a62e40e0afdad0559a77870ef9607ec96cf5b44538dba4cb90d7aa02ef30635dd62b5f60e01b8a8a8a8a8a8a60405161048f989796959493929190610858565b60405180910390a1809150509695505050505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006104de6104d9846109e1565b6109b0565b9050828152602081018484840111156104f657600080fd5b610501848285610b05565b509392505050565b60008151905061051881610b87565b92915050565b60008135905061052d81610b9e565b92915050565b60008083601f84011261054557600080fd5b8235905067ffffffffffffffff81111561055e57600080fd5b60208301915083600182028301111561057657600080fd5b9250929050565b600082601f83011261058e57600080fd5b813561059e8482602086016104cb565b91505092915050565b6000813590506105b681610bb5565b92915050565b6000815190506105cb81610bb5565b92915050565b6000602082840312156105e357600080fd5b60006105f184828501610509565b91505092915050565b6000806000806000806080878903121561061357600080fd5b600087013567ffffffffffffffff81111561062d57600080fd5b61063989828a01610533565b9650965050602087013567ffffffffffffffff81111561065857600080fd5b61066489828a01610533565b9450945050604087013567ffffffffffffffff81111561068357600080fd5b61068f89828a0161057d565b92505060606106a089828a0161051e565b9150509295509295509295565b6000602082840312156106bf57600080fd5b60006106cd848285016105bc565b91505092915050565b600080604083850312156106e957600080fd5b60006106f7858286016105a7565b92505060206107088582860161051e565b9150509250929050565b61071b81610a2d565b82525050565b61072a81610a4b565b82525050565b61073981610a55565b82525050565b61074881610aab565b82525050565b61075781610acf565b82525050565b61076681610af3565b82525050565b60006107788385610a1c565b9350610785838584610b05565b61078e83610b76565b840190509392505050565b60006107a482610a11565b6107ae8185610a1c565b93506107be818560208601610b14565b6107c781610b76565b840191505092915050565b60006107df600e83610a1c565b91507f4e6f742061676772656761746f720000000000000000000000000000000000006000830152602082019050919050565b61081b81610aa1565b82525050565b60006060820190506108366000830186610712565b6108436020830185610712565b610850604083018461075d565b949350505050565b600060c08201905061086d600083018b610712565b61087a602083018a610730565b818103604083015261088d81888a61076c565b905081810360608301526108a281868861076c565b905081810360808301526108b68185610799565b90506108c560a0830184610721565b9998505050505050505050565b60006040820190506108e76000830185610712565b6108f4602083018461075d565b9392505050565b60006020820190506109106000830184610721565b92915050565b600060408201905061092b6000830185610721565b6109386020830184610812565b9392505050565b6000602082019050610954600083018461073f565b92915050565b600060208201905061096f600083018461074e565b92915050565b6000602082019050818103600083015261098e816107d2565b9050919050565b60006020820190506109aa6000830184610812565b92915050565b6000604051905081810181811067ffffffffffffffff821117156109d7576109d6610b47565b5b8060405250919050565b600067ffffffffffffffff8211156109fc576109fb610b47565b5b601f19601f8301169050602081019050919050565b600081519050919050565b600082825260208201905092915050565b6000610a3882610a81565b9050919050565b60008115159050919050565b6000819050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6000610ab682610abd565b9050919050565b6000610ac882610a81565b9050919050565b6000610ada82610ae1565b9050919050565b6000610aec82610a81565b9050919050565b6000610afe82610aa1565b9050919050565b82818337600083830152505050565b60005b83811015610b32578082015181840152602081019050610b17565b83811115610b41576000848401525b50505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b610b9081610a3f565b8114610b9b57600080fd5b50565b610ba781610a4b565b8114610bb257600080fd5b50565b610bbe81610aa1565b8114610bc957600080fd5b5056fea26469706673582212203cdee31abf5e76d94b9041dc560eb2cbc9beb37442c7b710b8ba5faf2282e91964736f6c63430008000033";

type ExampleRequesterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExampleRequesterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ExampleRequester__factory extends ContractFactory {
  constructor(...args: ExampleRequesterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _link: string,
    _aggregator: string,
    _requestCost: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ExampleRequester> {
    return super.deploy(
      _link,
      _aggregator,
      _requestCost,
      overrides || {}
    ) as Promise<ExampleRequester>;
  }
  override getDeployTransaction(
    _link: string,
    _aggregator: string,
    _requestCost: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _link,
      _aggregator,
      _requestCost,
      overrides || {}
    );
  }
  override attach(address: string): ExampleRequester {
    return super.attach(address) as ExampleRequester;
  }
  override connect(signer: Signer): ExampleRequester__factory {
    return super.connect(signer) as ExampleRequester__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExampleRequesterInterface {
    return new utils.Interface(_abi) as ExampleRequesterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ExampleRequester {
    return new Contract(address, _abi, signerOrProvider) as ExampleRequester;
  }
}
