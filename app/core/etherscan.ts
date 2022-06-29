import axios from "axios"
import { Transaction } from "db"
import { getAddress } from "ethers/lib/utils"
import map from "lodash/map"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"

export const etherscan = axios.create({
  baseURL: "https://api.etherscan.io/",
  params: { apikey: process.env.ETHERSCAN_KEY! },
})

// ==========================
// Add the rate limiter queue
// ==========================
export const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.ETHERSCAN_RPS!),
    duration: 1,
  })
)

etherscan.interceptors.request.use(async (request) => {
  await queue.removeTokens(1)
  return request
})

export interface TransactionsQuery {
  address: string
  sort: "asc" | "desc"
  startblock: string
  endblock: string
}

export interface TransactionsResponse {
  status: "0" | "1"
  message: string
  result: {
    [key in keyof Transaction]: string
  }[]
}

export const getEtherscanTransactions = async ({ address, ...query }: TransactionsQuery) => {
  const { data } = await etherscan.get<TransactionsResponse>("api", {
    params: {
      ...query,
      module: "account",
      action: "txlist",
      page: 1,
      offset: 10000,
      address: getAddress(address),
    },
  })

  const { status, message, result } = data
  if (status !== "1") {
    throw new Error(`EtherscanError: ${message}`)
  }

  return map(result, (tx) => ({
    hash: tx.hash,
    from: tx.from && getAddress(tx.from),
    to: tx.to && getAddress(tx.to),
    value: tx.value,
    nonce: tx.nonce,
    contractAddress: tx.contractAddress,
    confirmations: tx.confirmations,
    cumulativeGasUsed: tx.cumulativeGasUsed,
    gas: tx.gas,
    gasUsed: tx.gasUsed,
    gasPrice: tx.gasPrice,
    blockHash: tx.blockHash,
    blockNumber: tx.blockNumber,
    transactionIndex: tx.transactionIndex,
    timeStamp: parseInt(tx.timeStamp, 10),
    isError: tx.isError != "0",
    gCO2: null,
  }))
}
