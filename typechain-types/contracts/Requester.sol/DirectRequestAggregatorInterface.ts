/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

export interface DirectRequestAggregatorInterfaceInterface
  extends utils.Interface {
  functions: {
    "makeRequest(string,string,string,bytes32,bytes32)": FunctionFragment;
  };

  getFunction(nameOrSignatureOrTopic: "makeRequest"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "makeRequest",
    values: [string, string, string, BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "makeRequest",
    data: BytesLike
  ): Result;

  events: {};
}

export interface DirectRequestAggregatorInterface extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DirectRequestAggregatorInterfaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      returnType: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  makeRequest(
    js: string,
    cid: string,
    vars: string,
    ref: BytesLike,
    returnType: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      returnType: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      returnType: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      returnType: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
