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
  AgreementRegistry,
  AgreementRegistryInterface,
} from "../../contracts/AgreementRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract LinkTokenInterface",
        name: "_linkToken",
        type: "address",
      },
      {
        internalType: "contract IUniversalAdapter",
        name: "_universalAdapter",
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
        indexed: true,
        internalType: "uint256",
        name: "agreementId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "agreementContractAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract Agreement",
        name: "agreement",
        type: "address",
      },
    ],
    name: "AgreementCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnerUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "agreements",
    outputs: [
      {
        internalType: "contract Agreement",
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
        internalType: "address",
        name: "redeemer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "soulbound",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "maxPayout",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "createAgreement",
    outputs: [
      {
        internalType: "contract Agreement",
        name: "agreement",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "creatorAgreements",
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
    name: "ids",
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
    name: "owner",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "redeemerAgreements",
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
    name: "requestCost",
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
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_requestCost",
        type: "uint256",
      },
    ],
    name: "setRequestCost",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162003db638038062003db6833981810160405281019062000037919062000264565b33806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a35082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600381905550505050620002c0565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000198826200016b565b9050919050565b6000620001ac826200018b565b9050919050565b620001be816200019f565b8114620001ca57600080fd5b50565b600081519050620001de81620001b3565b92915050565b6000620001f1826200018b565b9050919050565b6200020381620001e4565b81146200020f57600080fd5b50565b6000815190506200022381620001f8565b92915050565b6000819050919050565b6200023e8162000229565b81146200024a57600080fd5b50565b6000815190506200025e8162000233565b92915050565b60008060006060848603121562000280576200027f62000166565b5b60006200029086828701620001cd565b9350506020620002a38682870162000212565b9250506040620002b6868287016200024d565b9150509250925092565b613ae680620002d06000396000f3fe60806040523480156200001157600080fd5b50600436106200008e5760003560e01c80630badfa68146200009357806313af403514620000b55780631b9611cf14620000d55780638da5cb5b146200010b578063bd14de96146200012d578063c41578e91462000163578063ce11ece31462000183578063dafb82dd14620001b9578063e7657e1514620001ef575b600080fd5b6200009d62000211565b604051620000ac9190620008e0565b60405180910390f35b620000d36004803603810190620000cd919062000976565b62000217565b005b620000f36004803603810190620000ed9190620009d9565b62000345565b604051620001029190620008e0565b60405180910390f35b6200011562000377565b60405162000124919062000a31565b60405180910390f35b6200014b600480360381019062000145919062000a4e565b6200039b565b6040516200015a919062000aeb565b60405180910390f35b6200018160048036038101906200017b919062000a4e565b620003db565b005b620001a160048036038101906200019b9190620009d9565b62000476565b604051620001b09190620008e0565b60405180910390f35b620001d76004803603810190620001d1919062000ca7565b620004a8565b604051620001e6919062000aeb565b60405180910390f35b620001f9620008b1565b604051620002089190620008e0565b60405180910390f35b60035481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614620002a8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200029f9062000daf565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a350565b600760205281600052604060002081815481106200036257600080fd5b90600052602060002001600091509150505481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60068181548110620003ac57600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146200046c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620004639062000daf565b60405180910390fd5b8060038190555050565b600860205281600052604060002081815481106200049357600080fd5b90600052602060002001600091509150505481565b60008073ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff16036200051b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005129062000e21565b60405180910390fd5b42851162000560576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620005579062000e93565b60405180910390fd5b600060046000815480929190620005779062000ee4565b91905055905060003388600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600081548092919060010191905055604051602001620005e39392919062000fa6565b60405160208183030381529060405280519060200120905080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff163060035486338e8e8e8d6040516200065a90620008b7565b6200066f9a99989796959493929190620010d7565b8190604051809103906000f590508015801562000690573d6000803e3d6000fd5b509250600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd3385886040518463ffffffff1660e01b8152600401620006f4939291906200118e565b6020604051808303816000875af115801562000714573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200073a9190620011e2565b506006839080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020829080600181540180825580915050600190039060005260206000200160009091909190915055600860008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020829080600181540180825580915050600190039060005260206000200160009091909190915055817fe037ec30313eecdd927ffae3beed86a87b82f7bb794966ec08d75cf1a6e8268684856040516200089e92919062001214565b60405180910390a2505095945050505050565b60045481565b61286f806200124283390190565b6000819050919050565b620008da81620008c5565b82525050565b6000602082019050620008f76000830184620008cf565b92915050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200093e8262000911565b9050919050565b620009508162000931565b81146200095c57600080fd5b50565b600081359050620009708162000945565b92915050565b6000602082840312156200098f576200098e62000907565b5b60006200099f848285016200095f565b91505092915050565b620009b381620008c5565b8114620009bf57600080fd5b50565b600081359050620009d381620009a8565b92915050565b60008060408385031215620009f357620009f262000907565b5b600062000a03858286016200095f565b925050602062000a1685828601620009c2565b9150509250929050565b62000a2b8162000931565b82525050565b600060208201905062000a48600083018462000a20565b92915050565b60006020828403121562000a675762000a6662000907565b5b600062000a7784828501620009c2565b91505092915050565b6000819050919050565b600062000aab62000aa562000a9f8462000911565b62000a80565b62000911565b9050919050565b600062000abf8262000a8a565b9050919050565b600062000ad38262000ab2565b9050919050565b62000ae58162000ac6565b82525050565b600060208201905062000b02600083018462000ada565b92915050565b60008115159050919050565b62000b1f8162000b08565b811462000b2b57600080fd5b50565b60008135905062000b3f8162000b14565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b62000b9a8262000b4f565b810181811067ffffffffffffffff8211171562000bbc5762000bbb62000b60565b5b80604052505050565b600062000bd1620008fd565b905062000bdf828262000b8f565b919050565b600067ffffffffffffffff82111562000c025762000c0162000b60565b5b62000c0d8262000b4f565b9050602081019050919050565b82818337600083830152505050565b600062000c4062000c3a8462000be4565b62000bc5565b90508281526020810184848401111562000c5f5762000c5e62000b4a565b5b62000c6c84828562000c1a565b509392505050565b600082601f83011262000c8c5762000c8b62000b45565b5b813562000c9e84826020860162000c29565b91505092915050565b600080600080600060a0868803121562000cc65762000cc562000907565b5b600062000cd6888289016200095f565b955050602062000ce988828901620009c2565b945050604062000cfc8882890162000b2e565b935050606062000d0f88828901620009c2565b925050608086013567ffffffffffffffff81111562000d335762000d326200090c565b5b62000d418882890162000c74565b9150509295509295909350565b600082825260208201905092915050565b7f554e415554484f52495a45440000000000000000000000000000000000000000600082015250565b600062000d97600c8362000d4e565b915062000da48262000d5f565b602082019050919050565b6000602082019050818103600083015262000dca8162000d88565b9050919050565b7f494e56414c49445f52454445454d455200000000000000000000000000000000600082015250565b600062000e0960108362000d4e565b915062000e168262000dd1565b602082019050919050565b6000602082019050818103600083015262000e3c8162000dfa565b9050919050565b7f494e56414c49445f444541444c494e4500000000000000000000000000000000600082015250565b600062000e7b60108362000d4e565b915062000e888262000e43565b602082019050919050565b6000602082019050818103600083015262000eae8162000e6c565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600062000ef182620008c5565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820362000f265762000f2562000eb5565b5b600182019050919050565b60008160601b9050919050565b600062000f4b8262000f31565b9050919050565b600062000f5f8262000f3e565b9050919050565b62000f7b62000f758262000931565b62000f52565b82525050565b6000819050919050565b62000fa062000f9a82620008c5565b62000f81565b82525050565b600062000fb4828662000f66565b60148201915062000fc6828562000f66565b60148201915062000fd8828462000f8b565b602082019150819050949350505050565b600062000ff68262000ab2565b9050919050565b620010088162000fe9565b82525050565b60006200101b8262000ab2565b9050919050565b6200102d816200100e565b82525050565b6200103e8162000b08565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156200108057808201518184015260208101905062001063565b8381111562001090576000848401525b50505050565b6000620010a38262001044565b620010af81856200104f565b9350620010c181856020860162001060565b620010cc8162000b4f565b840191505092915050565b600061014082019050620010ef600083018d62000ffd565b620010fe602083018c62001022565b6200110d604083018b62000a20565b6200111c606083018a620008cf565b6200112b6080830189620008cf565b6200113a60a083018862000a20565b6200114960c083018762000a20565b6200115860e0830186620008cf565b6200116861010083018562001033565b8181036101208301526200117d818462001096565b90509b9a5050505050505050505050565b6000606082019050620011a5600083018662000a20565b620011b4602083018562000a20565b620011c36040830184620008cf565b949350505050565b600081519050620011dc8162000b14565b92915050565b600060208284031215620011fb57620011fa62000907565b5b60006200120b84828501620011cb565b91505092915050565b60006040820190506200122b600083018562000a20565b6200123a602083018462000ada565b939250505056fe6101606040523480156200001257600080fd5b506040516200286f3803806200286f833981810160405281019062000038919062000751565b84806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a3508973ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250508873ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250508773ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff16815250508660e0818152505085610100818152505083600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550826101208181525050811515610140811515815250506000600160146101000a81548160ff0219169083600381111562000202576200020162000866565b5b0217905550808060200190518101906200021d919062000a45565b60026000600360006005600060046000600660008a91905090805190602001906200024a929190620002c8565b508991905090805190602001906200026492919062000359565b508891905090805190602001906200027e92919062000359565b5087919050908051906020019062000298929190620002c8565b50869190509080519060200190620002b2929190620002c8565b5050505050505050505050505050505062000bcc565b828054620002d69062000b97565b90600052602060002090601f016020900481019282620002fa576000855562000346565b82601f106200031557805160ff191683800117855562000346565b8280016001018555821562000346579182015b828111156200034557825182559160200191906001019062000328565b5b509050620003559190620003c0565b5090565b828054828255906000526020600020908101928215620003ad579160200282015b82811115620003ac5782518290805190602001906200039b929190620002c8565b50916020019190600101906200037a565b5b509050620003bc9190620003df565b5090565b5b80821115620003db576000816000905550600101620003c1565b5090565b5b80821115620004035760008181620003f9919062000407565b50600101620003e0565b5090565b508054620004159062000b97565b6000825580601f106200042957506200044a565b601f016020900490600052602060002090810190620004499190620003c0565b5b50565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200048e8262000461565b9050919050565b6000620004a28262000481565b9050919050565b620004b48162000495565b8114620004c057600080fd5b50565b600081519050620004d481620004a9565b92915050565b6000620004e78262000481565b9050919050565b620004f981620004da565b81146200050557600080fd5b50565b6000815190506200051981620004ee565b92915050565b6200052a8162000481565b81146200053657600080fd5b50565b6000815190506200054a816200051f565b92915050565b6000819050919050565b620005658162000550565b81146200057157600080fd5b50565b60008151905062000585816200055a565b92915050565b60008115159050919050565b620005a2816200058b565b8114620005ae57600080fd5b50565b600081519050620005c28162000597565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6200061d82620005d2565b810181811067ffffffffffffffff821117156200063f576200063e620005e3565b5b80604052505050565b6000620006546200044d565b905062000662828262000612565b919050565b600067ffffffffffffffff821115620006855762000684620005e3565b5b6200069082620005d2565b9050602081019050919050565b60005b83811015620006bd578082015181840152602081019050620006a0565b83811115620006cd576000848401525b50505050565b6000620006ea620006e48462000667565b62000648565b905082815260208101848484011115620007095762000708620005cd565b5b620007168482856200069d565b509392505050565b600082601f830112620007365762000735620005c8565b5b815162000748848260208601620006d3565b91505092915050565b6000806000806000806000806000806101408b8d03121562000778576200077762000457565b5b6000620007888d828e01620004c3565b9a505060206200079b8d828e0162000508565b9950506040620007ae8d828e0162000539565b9850506060620007c18d828e0162000574565b9750506080620007d48d828e0162000574565b96505060a0620007e78d828e0162000539565b95505060c0620007fa8d828e0162000539565b94505060e06200080d8d828e0162000574565b935050610100620008218d828e01620005b1565b9250506101208b015167ffffffffffffffff8111156200084657620008456200045c565b5b620008548d828e016200071e565b9150509295989b9194979a5092959850565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600067ffffffffffffffff821115620008b357620008b2620005e3565b5b620008be82620005d2565b9050602081019050919050565b6000620008e2620008dc8462000895565b62000648565b905082815260208101848484011115620009015762000900620005cd565b5b6200090e8482856200069d565b509392505050565b600082601f8301126200092e576200092d620005c8565b5b815162000940848260208601620008cb565b91505092915050565b600067ffffffffffffffff821115620009675762000966620005e3565b5b602082029050602081019050919050565b600080fd5b6000620009946200098e8462000949565b62000648565b90508083825260208201905060208402830185811115620009ba57620009b962000978565b5b835b8181101562000a0857805167ffffffffffffffff811115620009e357620009e2620005c8565b5b808601620009f2898262000916565b85526020850194505050602081019050620009bc565b5050509392505050565b600082601f83011262000a2a5762000a29620005c8565b5b815162000a3c8482602086016200097d565b91505092915050565b600080600080600060a0868803121562000a645762000a6362000457565b5b600086015167ffffffffffffffff81111562000a855762000a846200045c565b5b62000a938882890162000916565b955050602086015167ffffffffffffffff81111562000ab75762000ab66200045c565b5b62000ac58882890162000916565b945050604086015167ffffffffffffffff81111562000ae95762000ae86200045c565b5b62000af78882890162000a12565b935050606086015167ffffffffffffffff81111562000b1b5762000b1a6200045c565b5b62000b298882890162000a12565b925050608086015167ffffffffffffffff81111562000b4d5762000b4c6200045c565b5b62000b5b8882890162000916565b9150509295509295909350565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168062000bb057607f821691505b60208210810362000bc65762000bc562000b68565b5b50919050565b60805160a05160c05160e051610100516101205161014051611bf762000c78600039600061020b01526000818161035a0152610d4e015260008181610a600152818161105301526110a50152600081816104e501526105c5015260005050600081816105a401528181610649015261076a0152600081816104a7015281816105680152818161082c015281816108f00152818161092d01528181610bd70152610c140152611bf76000f3fe608060405234801561001057600080fd5b50600436106100a45760003560e01c80630fad0f51146100a957806313af4035146100c757806329dcb0cf146100e3578063322000fa1461010157806334a84827146101315780635d64e31014610161578063653721471461017d5780638da5cb5b1461019b578063b79550be146101b9578063c19d93fb146101c3578063cf6ad876146101e1578063e2739491146101eb575b600080fd5b6100b1610209565b6040516100be9190611185565b60405180910390f35b6100e160048036038101906100dc9190611208565b61022d565b005b6100eb610358565b6040516100f8919061124e565b60405180910390f35b61011b600480360381019061011691906112ce565b61037c565b6040516101289190611368565b60405180910390f35b61014b60048036038101906101469190611208565b610748565b6040516101589190611185565b60405180910390f35b61017b600480360381019061017691906113af565b610768565b005b610185610aaf565b604051610192919061124e565b60405180910390f35b6101a3610ab5565b6040516101b091906113fe565b60405180910390f35b6101c1610ad9565b005b6101cb610d0f565b6040516101d89190611490565b60405180910390f35b6101e9610da6565b005b6101f36110a3565b604051610200919061124e565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146102bb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b290611508565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8292fce18fa69edf4db7b94ea2e58241df0ae57f97e0a6c9b29067028bf92d7660405160405180910390a350565b7f000000000000000000000000000000000000000000000000000000000000000081565b600080600381111561039157610390611419565b5b610399610d0f565b60038111156103ab576103aa611419565b5b146103eb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103e290611574565b60405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461047b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610472906115e0565b60405180910390fd5b60006006805461048a9061162f565b905011156104a5578282600691906104a39291906110c7565b505b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166323b872dd33307f00000000000000000000000000000000000000000000000000000000000000006040518463ffffffff1660e01b815260040161052293929190611660565b6020604051808303816000875af1158015610541573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056591906116c3565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663095ea7b37f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b81526004016106019291906116f0565b6020604051808303816000875af1158015610620573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064491906116c3565b5060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663d303e6a5635d64e31060e01b600260038a8a60066040518763ffffffff1660e01b81526004016106b496959493929190611836565b6020604051808303816000875af11580156106d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106f791906118bc565b9050807f5ef218ae96e09c55d1de0c9ef7c1270c967bcd5f4f8e045834ceee4b102be61460026003898960066040516107349594939291906118e9565b60405180910390a280915050949350505050565b60086020528060005260406000206000915054906101000a900460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146107f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ed90611998565b60405180910390fd5b60018060146101000a81548160ff0219169083600381111561081b5761081a611419565b5b02179055508060001c6007819055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168360001c6040518363ffffffff1660e01b81526004016108aa9291906116f0565b6020604051808303816000875af11580156108c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ed91906116c3565b507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb337f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161098491906113fe565b602060405180830381865afa1580156109a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c591906119e4565b6040518363ffffffff1660e01b81526004016109e29291906116f0565b6020604051808303816000875af1158015610a01573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a2591906116c3565b50817f0c2366233f634048c0f0458060d1228fab36d00f7c0ecf6bdf2d9c458503631182604051610a569190611368565b60405180910390a27f00000000000000000000000000000000000000000000000000000000000000007f52867b6621c82bd178a9944b8c1f1f29aba680811948fb9f8cfbd2fbd46108ee60405160405180910390a25050565b60075481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610b67576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b5e90611a5d565b60405180910390fd5b60006003811115610b7b57610b7a611419565b5b610b83610d0f565b6003811115610b9557610b94611419565b5b03610bd5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bcc90611ac9565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a9059cbb337f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610c6b91906113fe565b602060405180830381865afa158015610c88573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cac91906119e4565b6040518363ffffffff1660e01b8152600401610cc99291906116f0565b6020604051808303816000875af1158015610ce8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d0c91906116c3565b50565b600060016003811115610d2557610d24611419565b5b600160149054906101000a900460ff166003811115610d4757610d46611419565b5b14610d90577f00000000000000000000000000000000000000000000000000000000000000004211610d8857600160149054906101000a900460ff16610d8b565b60035b610da1565b600160149054906101000a900460ff165b905090565b60006003811115610dba57610db9611419565b5b610dc2610d0f565b6003811115610dd457610dd3611419565b5b14610e14576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e0b90611b35565b60405180910390fd5b600033905060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690508073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161480610ec65750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b610f05576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610efc90611ba1565b60405180910390fd5b6001600860008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600860008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff168015611021575060086000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b1561109f576002600160146101000a81548160ff0219169083600381111561104c5761104b611419565b5b02179055507f00000000000000000000000000000000000000000000000000000000000000007f0cae0523c4d6568388c55dcaeb921d927527a60000ca46adffedddf87225f0ec60405160405180910390a25b5050565b7f000000000000000000000000000000000000000000000000000000000000000081565b8280546110d39061162f565b90600052602060002090601f0160209004810192826110f5576000855561113c565b82601f1061110e57803560ff191683800117855561113c565b8280016001018555821561113c579182015b8281111561113b578235825591602001919060010190611120565b5b509050611149919061114d565b5090565b5b8082111561116657600081600090555060010161114e565b5090565b60008115159050919050565b61117f8161116a565b82525050565b600060208201905061119a6000830184611176565b92915050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006111d5826111aa565b9050919050565b6111e5816111ca565b81146111f057600080fd5b50565b600081359050611202816111dc565b92915050565b60006020828403121561121e5761121d6111a0565b5b600061122c848285016111f3565b91505092915050565b6000819050919050565b61124881611235565b82525050565b6000602082019050611263600083018461123f565b92915050565b600080fd5b600080fd5b600080fd5b60008083601f84011261128e5761128d611269565b5b8235905067ffffffffffffffff8111156112ab576112aa61126e565b5b6020830191508360018202830111156112c7576112c6611273565b5b9250929050565b600080600080604085870312156112e8576112e76111a0565b5b600085013567ffffffffffffffff811115611306576113056111a5565b5b61131287828801611278565b9450945050602085013567ffffffffffffffff811115611335576113346111a5565b5b61134187828801611278565b925092505092959194509250565b6000819050919050565b6113628161134f565b82525050565b600060208201905061137d6000830184611359565b92915050565b61138c8161134f565b811461139757600080fd5b50565b6000813590506113a981611383565b92915050565b600080604083850312156113c6576113c56111a0565b5b60006113d48582860161139a565b92505060206113e58582860161139a565b9150509250929050565b6113f8816111ca565b82525050565b600060208201905061141360008301846113ef565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6004811061145957611458611419565b5b50565b600081905061146a82611448565b919050565b600061147a8261145c565b9050919050565b61148a8161146f565b82525050565b60006020820190506114a56000830184611481565b92915050565b600082825260208201905092915050565b7f554e415554484f52495a45440000000000000000000000000000000000000000600082015250565b60006114f2600c836114ab565b91506114fd826114bc565b602082019050919050565b60006020820190508181036000830152611521816114e5565b9050919050565b7f494e4143544956455f41475245454d454e540000000000000000000000000000600082015250565b600061155e6012836114ab565b915061156982611528565b602082019050919050565b6000602082019050818103600083015261158d81611551565b9050919050565b7f494e56414c49445f52454445454d455200000000000000000000000000000000600082015250565b60006115ca6010836114ab565b91506115d582611594565b602082019050919050565b600060208201905081810360008301526115f9816115bd565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061164757607f821691505b60208210810361165a57611659611600565b5b50919050565b600060608201905061167560008301866113ef565b61168260208301856113ef565b61168f604083018461123f565b949350505050565b6116a08161116a565b81146116ab57600080fd5b50565b6000815190506116bd81611697565b92915050565b6000602082840312156116d9576116d86111a0565b5b60006116e7848285016116ae565b91505092915050565b600060408201905061170560008301856113ef565b611712602083018461123f565b9392505050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61174e81611719565b82525050565b60008190508160005260206000209050919050565b600081546117768161162f565b61178081866114ab565b9450600182166000811461179b57600181146117ad576117e0565b60ff19831686526020860193506117e0565b6117b685611754565b60005b838110156117d8578154818901526001820191506020810190506117b9565b808801955050505b50505092915050565b82818337600083830152505050565b6000601f19601f8301169050919050565b600061181583856114ab565b93506118228385846117e9565b61182b836117f8565b840190509392505050565b600060a08201905061184b6000830189611745565b818103602083015261185d8188611769565b905081810360408301526118718187611769565b90508181036060830152611886818587611809565b9050818103608083015261189a8184611769565b9050979650505050505050565b6000815190506118b681611383565b92915050565b6000602082840312156118d2576118d16111a0565b5b60006118e0848285016118a7565b91505092915050565b600060808201905081810360008301526119038188611769565b905081810360208301526119178187611769565b9050818103604083015261192c818587611809565b905081810360608301526119408184611769565b90509695505050505050565b7f4e6f7420556e6976657273616c20416461707465720000000000000000000000600082015250565b60006119826015836114ab565b915061198d8261194c565b602082019050919050565b600060208201905081810360008301526119b181611975565b9050919050565b6119c181611235565b81146119cc57600080fd5b50565b6000815190506119de816119b8565b92915050565b6000602082840312156119fa576119f96111a0565b5b6000611a08848285016119cf565b91505092915050565b7f4f4e4c595f4f574e455200000000000000000000000000000000000000000000600082015250565b6000611a47600a836114ab565b9150611a5282611a11565b602082019050919050565b60006020820190508181036000830152611a7681611a3a565b9050919050565b7f5354494c4c5f50454e44494e4700000000000000000000000000000000000000600082015250565b6000611ab3600d836114ab565b9150611abe82611a7d565b602082019050919050565b60006020820190508181036000830152611ae281611aa6565b9050919050565b7f43414e4e4f545f43414e43454c00000000000000000000000000000000000000600082015250565b6000611b1f600d836114ab565b9150611b2a82611ae9565b602082019050919050565b60006020820190508181036000830152611b4e81611b12565b9050919050565b7f4e4f545f414c4c4f574544000000000000000000000000000000000000000000600082015250565b6000611b8b600b836114ab565b9150611b9682611b55565b602082019050919050565b60006020820190508181036000830152611bba81611b7e565b905091905056fea26469706673582212203f55587e87c50d8a91c3f07638fdc3700911440aceba9d47bd6f0e95dee3d0ac64736f6c634300080e0033a2646970667358221220ea0e152e700b816a283db96d5ae5c0b322930b4b0aa56df805ab4978265465fe64736f6c634300080e0033";

type AgreementRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AgreementRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AgreementRegistry__factory extends ContractFactory {
  constructor(...args: AgreementRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _linkToken: string,
    _universalAdapter: string,
    _requestCost: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<AgreementRegistry> {
    return super.deploy(
      _linkToken,
      _universalAdapter,
      _requestCost,
      overrides || {}
    ) as Promise<AgreementRegistry>;
  }
  override getDeployTransaction(
    _linkToken: string,
    _universalAdapter: string,
    _requestCost: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _linkToken,
      _universalAdapter,
      _requestCost,
      overrides || {}
    );
  }
  override attach(address: string): AgreementRegistry {
    return super.attach(address) as AgreementRegistry;
  }
  override connect(signer: Signer): AgreementRegistry__factory {
    return super.connect(signer) as AgreementRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AgreementRegistryInterface {
    return new utils.Interface(_abi) as AgreementRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AgreementRegistry {
    return new Contract(address, _abi, signerOrProvider) as AgreementRegistry;
  }
}
