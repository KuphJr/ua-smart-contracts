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

export interface RequesterInterface extends utils.Interface {
  functions: {
    "aggregatorContract()": FunctionFragment;
    "expirationTime()": FunctionFragment;
    "fulfillDirectRequest(uint256,uint256)": FunctionFragment;
    "fulfillOffer(string,string)": FunctionFragment;
    "getState()": FunctionFragment;
    "initalizeOffer(uint256)": FunctionFragment;
    "isFulfilled()": FunctionFragment;
    "linkTokenContract()": FunctionFragment;
    "offeree()": FunctionFragment;
    "offerer()": FunctionFragment;
    "recoverFunds()": FunctionFragment;
    "registryContract()": FunctionFragment;
    "registryIndex()": FunctionFragment;
    "requestNumber()": FunctionFragment;
    "scriptIpfsHash()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "aggregatorContract"
      | "expirationTime"
      | "fulfillDirectRequest"
      | "fulfillOffer"
      | "getState"
      | "initalizeOffer"
      | "isFulfilled"
      | "linkTokenContract"
      | "offeree"
      | "offerer"
      | "recoverFunds"
      | "registryContract"
      | "registryIndex"
      | "requestNumber"
      | "scriptIpfsHash"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "aggregatorContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "expirationTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "fulfillDirectRequest",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "fulfillOffer",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "getState", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "initalizeOffer",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isFulfilled",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "linkTokenContract",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "offeree", values?: undefined): string;
  encodeFunctionData(functionFragment: "offerer", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "recoverFunds",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registryContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registryIndex",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requestNumber",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "scriptIpfsHash",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "aggregatorContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "expirationTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fulfillDirectRequest",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "fulfillOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getState", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "initalizeOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isFulfilled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "linkTokenContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "offeree", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "offerer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "recoverFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registryContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registryIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestNumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "scriptIpfsHash",
    data: BytesLike
  ): Result;

  events: {
    "ExpiredOfferFulfilled(uint256,uint256,uint256)": EventFragment;
    "OfferFulfilled(uint256,uint256,uint256)": EventFragment;
    "RequestSent(address,bytes4,string,string,string,bytes32,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ExpiredOfferFulfilled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OfferFulfilled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RequestSent"): EventFragment;
}

export interface ExpiredOfferFulfilledEventObject {
  expiredPaymentAmount: BigNumber;
  registryIndex: BigNumber;
  requestNumber: BigNumber;
}
export type ExpiredOfferFulfilledEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  ExpiredOfferFulfilledEventObject
>;

export type ExpiredOfferFulfilledEventFilter =
  TypedEventFilter<ExpiredOfferFulfilledEvent>;

export interface OfferFulfilledEventObject {
  paymentAmount: BigNumber;
  registryIndex: BigNumber;
  requestNumber: BigNumber;
}
export type OfferFulfilledEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  OfferFulfilledEventObject
>;

export type OfferFulfilledEventFilter = TypedEventFilter<OfferFulfilledEvent>;

export interface RequestSentEventObject {
  callbackAddress: string;
  callbackFunctionId: string;
  js: string;
  cid: string;
  vars: string;
  ref: string;
  registryIndex: BigNumber;
  requestNumber: BigNumber;
}
export type RequestSentEvent = TypedEvent<
  [string, string, string, string, string, string, BigNumber, BigNumber],
  RequestSentEventObject
>;

export type RequestSentEventFilter = TypedEventFilter<RequestSentEvent>;

export interface Requester extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RequesterInterface;

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

    expirationTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      amountOwed: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    fulfillOffer(
      url: string,
      apiKey: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getState(overrides?: CallOverrides): Promise<[string] & { state: string }>;

    initalizeOffer(
      maxOfferValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isFulfilled(overrides?: CallOverrides): Promise<[boolean]>;

    linkTokenContract(overrides?: CallOverrides): Promise<[string]>;

    offeree(overrides?: CallOverrides): Promise<[string]>;

    offerer(overrides?: CallOverrides): Promise<[string]>;

    recoverFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    registryContract(overrides?: CallOverrides): Promise<[string]>;

    registryIndex(overrides?: CallOverrides): Promise<[BigNumber]>;

    requestNumber(overrides?: CallOverrides): Promise<[BigNumber]>;

    scriptIpfsHash(overrides?: CallOverrides): Promise<[string]>;
  };

  aggregatorContract(overrides?: CallOverrides): Promise<string>;

  expirationTime(overrides?: CallOverrides): Promise<BigNumber>;

  fulfillDirectRequest(
    _requestNumber: BigNumberish,
    amountOwed: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  fulfillOffer(
    url: string,
    apiKey: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getState(overrides?: CallOverrides): Promise<string>;

  initalizeOffer(
    maxOfferValue: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isFulfilled(overrides?: CallOverrides): Promise<boolean>;

  linkTokenContract(overrides?: CallOverrides): Promise<string>;

  offeree(overrides?: CallOverrides): Promise<string>;

  offerer(overrides?: CallOverrides): Promise<string>;

  recoverFunds(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  registryContract(overrides?: CallOverrides): Promise<string>;

  registryIndex(overrides?: CallOverrides): Promise<BigNumber>;

  requestNumber(overrides?: CallOverrides): Promise<BigNumber>;

  scriptIpfsHash(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    aggregatorContract(overrides?: CallOverrides): Promise<string>;

    expirationTime(overrides?: CallOverrides): Promise<BigNumber>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      amountOwed: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    fulfillOffer(
      url: string,
      apiKey: string,
      overrides?: CallOverrides
    ): Promise<void>;

    getState(overrides?: CallOverrides): Promise<string>;

    initalizeOffer(
      maxOfferValue: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    isFulfilled(overrides?: CallOverrides): Promise<boolean>;

    linkTokenContract(overrides?: CallOverrides): Promise<string>;

    offeree(overrides?: CallOverrides): Promise<string>;

    offerer(overrides?: CallOverrides): Promise<string>;

    recoverFunds(overrides?: CallOverrides): Promise<void>;

    registryContract(overrides?: CallOverrides): Promise<string>;

    registryIndex(overrides?: CallOverrides): Promise<BigNumber>;

    requestNumber(overrides?: CallOverrides): Promise<BigNumber>;

    scriptIpfsHash(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "ExpiredOfferFulfilled(uint256,uint256,uint256)"(
      expiredPaymentAmount?: null,
      registryIndex?: null,
      requestNumber?: null
    ): ExpiredOfferFulfilledEventFilter;
    ExpiredOfferFulfilled(
      expiredPaymentAmount?: null,
      registryIndex?: null,
      requestNumber?: null
    ): ExpiredOfferFulfilledEventFilter;

    "OfferFulfilled(uint256,uint256,uint256)"(
      paymentAmount?: null,
      registryIndex?: null,
      requestNumber?: null
    ): OfferFulfilledEventFilter;
    OfferFulfilled(
      paymentAmount?: null,
      registryIndex?: null,
      requestNumber?: null
    ): OfferFulfilledEventFilter;

    "RequestSent(address,bytes4,string,string,string,bytes32,uint256,uint256)"(
      callbackAddress?: null,
      callbackFunctionId?: null,
      js?: null,
      cid?: null,
      vars?: null,
      ref?: null,
      registryIndex?: null,
      requestNumber?: null
    ): RequestSentEventFilter;
    RequestSent(
      callbackAddress?: null,
      callbackFunctionId?: null,
      js?: null,
      cid?: null,
      vars?: null,
      ref?: null,
      registryIndex?: null,
      requestNumber?: null
    ): RequestSentEventFilter;
  };

  estimateGas: {
    aggregatorContract(overrides?: CallOverrides): Promise<BigNumber>;

    expirationTime(overrides?: CallOverrides): Promise<BigNumber>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      amountOwed: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    fulfillOffer(
      url: string,
      apiKey: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getState(overrides?: CallOverrides): Promise<BigNumber>;

    initalizeOffer(
      maxOfferValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isFulfilled(overrides?: CallOverrides): Promise<BigNumber>;

    linkTokenContract(overrides?: CallOverrides): Promise<BigNumber>;

    offeree(overrides?: CallOverrides): Promise<BigNumber>;

    offerer(overrides?: CallOverrides): Promise<BigNumber>;

    recoverFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    registryContract(overrides?: CallOverrides): Promise<BigNumber>;

    registryIndex(overrides?: CallOverrides): Promise<BigNumber>;

    requestNumber(overrides?: CallOverrides): Promise<BigNumber>;

    scriptIpfsHash(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    aggregatorContract(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    expirationTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    fulfillDirectRequest(
      _requestNumber: BigNumberish,
      amountOwed: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    fulfillOffer(
      url: string,
      apiKey: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initalizeOffer(
      maxOfferValue: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isFulfilled(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    linkTokenContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    offeree(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    offerer(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recoverFunds(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    registryContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    registryIndex(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    requestNumber(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    scriptIpfsHash(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
