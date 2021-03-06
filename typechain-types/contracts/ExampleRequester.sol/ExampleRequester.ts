/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "../../common";

export interface ExampleRequesterInterface extends utils.Interface {
  functions: {
    "aggregatorContract()": FunctionFragment;
    "fulfillDirectRequest(uint256,bytes32)": FunctionFragment;
    "linkTokenContract()": FunctionFragment;
    "makeRequest(string,string,string,bytes32)": FunctionFragment;
    "result()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "aggregatorContract"
      | "fulfillDirectRequest"
      | "linkTokenContract"
      | "makeRequest"
      | "result"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "aggregatorContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fulfillDirectRequest",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "linkTokenContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "makeRequest",
    values: [string, string, string, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "result", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "aggregatorContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fulfillDirectRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "linkTokenContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "makeRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "result", data: BytesLike): Result;

  events: {
    "RequestFulfilled(bytes32,uint256)": EventFragment;
    "RequestSent(address,bytes4,string,string,string,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RequestFulfilled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestSent"): EventFragment;
}

export interface RequestFulfilledEventObject {
  result: string;
  requestNumber: BigNumber;
}
export type RequestFulfilledEvent = TypedEvent<
  [string, BigNumber],
  RequestFulfilledEventObject
>;

export type RequestFulfilledEventFilter =
  TypedEventFilter<RequestFulfilledEvent>;

export interface RequestSentEventObject {
  callbackAddress: string;
  callbackFunctionId: string;
  js: string;
  cid: string;
  vars: string;
  ref: string;
}
export type RequestSentEvent = TypedEvent<
  [string, string, string, string, string, string],
  RequestSentEventObject
>;

export type RequestSentEventFilter = TypedEventFilter<RequestSentEvent>;

export interface ExampleRequester extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ExampleRequesterInterface;

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
    aggregatorContract(overrides?: CallOverrides): Promise<[string]>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      _result: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    linkTokenContract(overrides?: CallOverrides): Promise<[string]>;

    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    result(overrides?: CallOverrides): Promise<[string]>;
  };

  aggregatorContract(overrides?: CallOverrides): Promise<string>;

  fulfillDirectRequest(
    _requestNumber: BigNumberish,
    _result: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  linkTokenContract(overrides?: CallOverrides): Promise<string>;

  makeRequest(
    js: string,
    cid: string,
    vars: string,
    ref: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  result(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    aggregatorContract(overrides?: CallOverrides): Promise<string>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      _result: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    linkTokenContract(overrides?: CallOverrides): Promise<string>;

    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    result(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "RequestFulfilled(bytes32,uint256)"(
      result?: null,
      requestNumber?: null
    ): RequestFulfilledEventFilter;
    RequestFulfilled(
      result?: null,
      requestNumber?: null
    ): RequestFulfilledEventFilter;

    "RequestSent(address,bytes4,string,string,string,bytes32)"(
      callbackAddress?: null,
      callbackFunctionId?: null,
      js?: null,
      cid?: null,
      vars?: null,
      ref?: null
    ): RequestSentEventFilter;
    RequestSent(
      callbackAddress?: null,
      callbackFunctionId?: null,
      js?: null,
      cid?: null,
      vars?: null,
      ref?: null
    ): RequestSentEventFilter;
  };

  estimateGas: {
    aggregatorContract(overrides?: CallOverrides): Promise<BigNumber>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      _result: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    linkTokenContract(overrides?: CallOverrides): Promise<BigNumber>;

    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    result(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    aggregatorContract(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      _result: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    linkTokenContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    makeRequest(
      js: string,
      cid: string,
      vars: string,
      ref: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    result(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
