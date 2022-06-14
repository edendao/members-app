import axios from "axios"
import { Transaction } from "db"
import { getAddress } from "ethers/lib/utils"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"

export const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.ETHERSCAN_RPS!),
    duration: 1,
  })
)

export interface EtherscanTransactionsQuery {
  address: string
  sort: "asc" | "desc"
  startblock: string
  endblock: string
}

export interface EtherscanTransactionsResult {
  status: "0" | "1"
  message: string
  result: Array<Record<string, string>>
}

export class EtherscanError extends Error {
  toString() {
    return `EtherscanError: ${super.toString()}`
  }
}

export const getEtherscanTransactions = async (
  query: EtherscanTransactionsQuery
): Promise<Transaction[]> => {
  await queue.removeTokens(1)

  const { data } = await etherscan.get<EtherscanTransactionsResult>("", {
    params: {
      module: "account",
      action: "txlist",
      page: "1",
      offset: "10000",
      ...query,
    },
  })

  const { status, message, result } = data
  if (status !== "1") {
    throw new EtherscanError(message)
  }

  return result.map(mapToTransaction)
}

const mapToTransaction = (tx: any) =>
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

export const etherscan = axios.create({
  baseURL: "https://api.etherscan.io/api",
  params: {
    apikey: process.env.ETHERSCAN_KEY!,
  },
})
