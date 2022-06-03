import { ethers } from "hardhat"
import { Contract, Signer } from "ethers"
import { randomInt } from 'crypto'
import fs from 'fs'

export const createNodeWallets = async (
  numWallets: number
):Promise<{ nodeWallets: Signer[], nodeAddresses: string[] }> => {
  const nodeWallets = randomSigners(numWallets)
  let nodeAddresses = []
  let i = 0
  for (const wallet of nodeWallets) {
    nodeAddresses[i] = await wallet.getAddress()
    i++
  }
  const accounts = await ethers.getSigners()
  // fund all the wallets so they can pay for gas
  let tx
  for (const address of nodeAddresses) {
    tx = await accounts[0].sendTransaction({
      to: await address,
      value: BigInt('10000000000000000')
    })
  }
  if (tx?.hash)
    await ethers.provider.waitForTransaction(tx.hash)
  return { nodeWallets, nodeAddresses }
}

const randomSigners = (amount: number): Signer[] => {
  const signers: Signer[] = []
  for (let i = 0; i < amount; i++) {
    const randomWallet = ethers.Wallet.createRandom()
    signers.push(randomWallet.connect(ethers.provider))
  }
  return signers
}

export const setupContracts = async (
  nodeAddresses: string[],
  linkTokenAddress: string
): Promise<{ universalAdapter: Contract, requester: Contract, linkToken: Contract }> => {
  const UniversalAdapter = await ethers.getContractFactory("UniversalAdapter")
  const universalAdapter = await UniversalAdapter.deploy(
    linkTokenAddress,
    nodeAddresses,
    // the nodeWallet that sends transactions is the same as the address that
    // is allowed to collect payment in this example.
    nodeAddresses
  )
  const deployTx = await ethers.provider.waitForTransaction(universalAdapter.deployTransaction.hash)
  const Requester = await ethers.getContractFactory("Requester")
  const requester = await Requester.deploy(
    linkTokenAddress,
    deployTx.contractAddress,
    100
  )
  const LinkToken = await ethers.getContractFactory('LinkToken')
  const linkToken = await LinkToken.attach(linkTokenAddress)
  await requester.deployed()
  return { universalAdapter, requester, linkToken }
}

type Address = string
type RequestId = string
type Answer = string
type Salt = bigint
const cachedResponses: Record<Address, Record<RequestId, [Answer, Salt]>> = {}
const failedTxLog: { gasUsed: number }[] = []
const hashedResponseLog: { success: boolean, gasUsed: number }[] = []
const unhashedResponseLog: { success: boolean, gasUsed: number }[] = []

export const mockChainlinkNodes = (
  universalAdapter: Contract,
  nodeWallets: Signer[]
) => {
  universalAdapter.on(
    'OracleRequest',
    ( specId, requester, requestId, payment, callbackAddr, callbackFunctionId, cancelExpiration, dataVersion, data) => {
      console.log('OracleRequest Emitted')
      if (specId == '0x3363313763343939373562353432323038613864376539636133333430386531')
        handleHashedResponses(requestId, nodeWallets, universalAdapter)
      if (specId == '0x6339653230663039656138373432393462316166396533666233613338313739')
        handleUnhashedResponses(requestId, nodeWallets, universalAdapter)
    }
  )
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const handleHashedResponses = async (requestId: string, nodeWallets: Signer[], universalAdapter: Contract) => {    
    const hashedResponseTransactions = []
    // sort the nodes so they respond in random order
    for (const wallet of nodeWallets/*.sort(() => (Math.random() > .5) ? 1 : -1)*/) {
      const answer = getRandomResponse()
      const { hashedAnswer, salt } = getHashedAnswer(answer)
      if (!cachedResponses[await wallet.getAddress()])
        cachedResponses[await wallet.getAddress()] = {}
      cachedResponses[await wallet.getAddress()][requestId] = [answer.toString(16), salt]
      const initialBalance = BigInt((await wallet.getBalance()).toString())
      try {
        const tx = await universalAdapter.connect(wallet).respondWithHashedAnswer(
          requestId, hashedAnswer, { gasLimit: 500000 }
        )
        hashedResponseTransactions.push(tx)
      }
      catch (error) {
        const gasPrice = BigInt((await ethers.provider.getGasPrice()).toString())
        const endingBalance = BigInt((await wallet.getBalance()).toString())
        const gasUsed = (initialBalance - endingBalance) / gasPrice
        failedTxLog.push({ gasUsed: parseInt(gasUsed.toString()) })
      }
    }
    for (const tx of hashedResponseTransactions) {
      const txResult = await ethers.provider.waitForTransaction(tx.hash)
      hashedResponseLog.push({ success: !!txResult.status, gasUsed: txResult.cumulativeGasUsed.toNumber() })
    }
    fs.writeFileSync('./logs/hashedResponseLog.json', JSON.stringify(hashedResponseLog))
}

const handleUnhashedResponses = async (requestId: string, nodeWallets: Signer[], universalAdapter: Contract) => {
  const unhashedResponseTransactions = []
  for (const wallet of nodeWallets/*.sort(() => (Math.random() > .5) ? 1 : -1)*/) {
    const [ answer, salt ] = cachedResponses[await wallet.getAddress()][requestId]
    const initialBalance = BigInt((await wallet.getBalance()).toString())
    try {
      const tx = await universalAdapter.connect(wallet).respondWithUnhashedAnswer(
        requestId, salt, ethers.utils.hexZeroPad('0x' + answer, 32), { gasLimit: 500000 }
      )
      unhashedResponseTransactions.push(tx)
    } catch (error) {
      const gasPrice = BigInt((await ethers.provider.getGasPrice()).toString())
      const endingBalance = BigInt((await wallet.getBalance()).toString())
      const gasUsed = (initialBalance - endingBalance) / gasPrice
      failedTxLog.push({ gasUsed: parseInt(gasUsed.toString()) })
    }
  }
  let txResult
  for (const tx of unhashedResponseTransactions) {
    try {
      txResult = await ethers.provider.waitForTransaction(tx.hash)
    } catch (error) {
      //console.log(JSON.stringify(error))
    }
    if (txResult)
      unhashedResponseLog.push({ success: !!txResult.status, gasUsed: txResult.cumulativeGasUsed.toNumber() })
  }

  fs.writeFileSync('./logs/unhashedResponseLog.json', JSON.stringify(unhashedResponseLog))
  fs.writeFileSync('./logs/failedTxLog.json', JSON.stringify(failedTxLog))
  let totalGas = 0
  hashedResponseLog.map((log) => totalGas = totalGas + log.gasUsed)
  unhashedResponseLog.map((log) => totalGas = totalGas + log.gasUsed)
  failedTxLog.map((log) => totalGas = totalGas + log.gasUsed)
  console.log('Total Gas Used: ' + totalGas)
}

const getHashedAnswer = (answer: bigint): { hashedAnswer: string, salt: bigint } => {
  const salt = BigInt(randomInt(0, 281474976710655))
  const answerPlusSalt = BigInt('0b' + (answer + salt).toString(2).slice(-256))
  const fullHashedAnswer = ethers.utils.keccak256(
    ethers.utils.hexZeroPad('0x' + answerPlusSalt.toString(16), 32)
  )
  const last4Bytes = BigInt('0b' + BigInt(fullHashedAnswer).toString(2).slice(-64)).toString(16)
  return { hashedAnswer: ethers.utils.hexZeroPad('0x' + last4Bytes, 8), salt }
}

// Generates a BigInt equal to 95, plus a random number between 0 and 10 (inclusive)
const getRandomResponse = () => BigInt(95 + Math.floor(Math.random() * 10))

export const setupRequesterLogging = (
  requester: Contract
) => {
  requester.on('RequestSent',
    (
      callbackFunctionId,
      js,
      cid,
      vars,
      ref
    ) => {
      console.log('Logging request sent event')
    }
  )
  requester.on('RequestFulfilled',
    (
      result,
      requestId
    ) => {
      console.log('🎉 Request Fulfilled! 🎉')
      console.log({ result, requestId })
    }
  )
}