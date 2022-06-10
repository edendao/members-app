import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import db, { Transaction } from "db"
import { getAddress } from "ethers/lib/utils"
import fetch from "node-fetch"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (endblock, { session }) => {
  const { address } = await session.$getPrivateData()
  const startblock = await findStartblockForAddress(address)
  const txs = await getEtherscanTransactions({ address, startblock, endblock, sort: "asc" })

  if (txs.length !== 0) {
    await db.$transaction(
      txs.map((tx: any) =>
        db.transaction.upsert({
          where: { hash: tx.hash },
          create: tx,
          update: { confirmations: tx.confirmations },
        })
      )
    )
  }

  return await db.transaction.findMany({
    select: { hash: true, blockNumber: true, gasUsed: true, timeStamp: true, gCO2: true },
    where: { from: address },
    orderBy: { blockNumber: "desc" },
  })
})

export const findStartblockForAddress = async (address: string) => {
  const lasttx = await db.transaction.findFirst({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true },
  })

  return lasttx?.blockNumber ?? "0"
}

const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.ETHERSCAN_RPS!),
    duration: 1,
  })
)

interface EtherscanTransactionsQuery {
  address: string
  sort: "asc" | "desc"
  startblock: string
  endblock: string
}

export class EtherscanError extends Error {
  toString() {
    return `EtherscanError: ${super.toString()}`
  }
}

export const getEtherscanTransactions = async (query: EtherscanTransactionsQuery) => {
  const url = new URL(baseURL.toString())
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value)
  }

  const response = await queue.removeTokens(1).then(() => fetch(url))
  const { status, message, result } = await response.json()
  if (status !== "1") {
    throw new EtherscanError(message)
  }

  return result.map(etherscanMapper)
}

const etherscanMapper = (tx: any) =>
  ({
    hash: tx.hash,
    from: getAddress(tx.from),
    to: getAddress(tx.to),
    contractAddress: tx.contractAddress,
    value: tx.value,
    nonce: tx.nonce,
    timeStamp: parseInt(tx.timeStamp),
    confirmations: tx.confirmations,
    isError: tx.isError != "0",
    cumulativeGasUsed: tx.cumulativeGasUsed,
    gas: tx.gas,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    blockHash: tx.blockHash,
    blockNumber: tx.blockNumber,
    transactionIndex: tx.transactionIndex,
  } as Transaction)

export const baseURL = new URL("https://api.etherscan.io/api")
for (const [key, value] of Object.entries({
  module: "account",
  action: "txlist",
  page: "1",
  offset: "10000",
  apikey: process.env.ETHERSCAN_KEY!,
})) {
  baseURL.searchParams.set(key, value)
}
