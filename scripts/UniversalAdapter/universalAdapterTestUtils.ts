import { ethers } from "hardhat"
import { Contract, Signer, BigNumber } from "ethers"
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

export const mockChainlinkNodes = (
  universalAdapter: Contract,
  nodeWallets: Signer[]
) => {
  type Address = string
  type RequestId = string
  type Answer = string
  type Salt = bigint
  const cachedResponses: Record<Address, Record<RequestId, [Answer, Salt]>> = {}
  let i = 1;
  universalAdapter.on('OracleRequest',
    async (
      specId,
      requester,
      requestId,
      payment,
      callbackAddr,
      callbackFunctionId,
      cancelExpiration,
      dataVersion,
      data
    ) => {
      console.log('OracleRequest Emitted')
      const hashedResponseLog: { success: boolean, gasUsed: number }[] = []
      const unhashedResponseLog: { success: boolean, gasUsed: number }[] = []
      // hashed response jobspec
      if (specId == '0x3363313763343939373562353432323038613864376539636133333430386531') {
        const hashedResponseTransactions = []
        // sort the nodes so they respond in random order
        for (const wallet of nodeWallets.sort(() => (Math.random() > .5) ? 1 : -1)) {
          const answer = getRandomResponse()
          const { hashedAnswer, salt } = getHashedAnswer(answer)
          if (!cachedResponses[await wallet.getAddress()])
            cachedResponses[await wallet.getAddress()] = {}
          cachedResponses[await wallet.getAddress()][requestId] = [answer.toString(16), salt]
          try {
            const tx = await universalAdapter.connect(wallet).respondWithHashedAnswer(
              requestId, hashedAnswer, { gasLimit: 500000 }
            )
            hashedResponseTransactions.push(tx)
          }
          catch (error) {
            console.log('Unhashed response transaction failed with message: ' + (error as Error).message)
          }
        }
        for (const tx of hashedResponseTransactions) {
          const txResult = await ethers.provider.waitForTransaction(tx.hash)
          hashedResponseLog.push({ success: !!txResult.status, gasUsed: txResult.cumulativeGasUsed.toNumber() })
        }
        fs.writeFileSync('hashedResponseLog.json', JSON.stringify(hashedResponseLog))
      }
      if (specId == '0x6339653230663039656138373432393462316166396533666233613338313739') {
        const unhashedResponseTransactions = []
        for (const wallet of nodeWallets.sort(() => (Math.random() > .5) ? 1 : -1)) {
          const [ answer, salt ] = cachedResponses[await wallet.getAddress()][requestId]
          try {
            const tx = await universalAdapter.connect(wallet).respondWithUnhashedAnswer(
              requestId, salt, ethers.utils.hexZeroPad('0x' + answer, 32), { gasLimit: 500000 }
            )
            unhashedResponseTransactions.push(tx)
          } catch (error) {
            console.log('Hashed response transaction failed with message: ' + (error as Error).message)
          }
        }
        for (const tx of unhashedResponseTransactions) {
          const txResult = await ethers.provider.waitForTransaction(tx.hash)
          unhashedResponseLog.push({ success: !!txResult.status, gasUsed: txResult.cumulativeGasUsed.toNumber() })
        }
        fs.writeFileSync('unhashedResponseLog.json', JSON.stringify(unhashedResponseLog))
      }
    }
  )
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