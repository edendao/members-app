import { AuthorizationError, resolver } from "blitz"
import db from "db"
import fetch from "node-fetch"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"

export default resolver.pipe(resolver.authorize(), async (_ = null, { session }) => {
  const { walletAddress } = await session.$getPrivateData()
  if (!walletAddress) {
    throw new AuthorizationError("Missing walletAddress")
  }

  const transactions = await reloadAndCacheTransactions(walletAddress)
  return transactions
})

export const reloadAndCacheTransactions = async (address: string) => {
  const lastTransaction = await db.transaction.findFirst({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true },
  })

  let lastBlockNumber = lastTransaction?.blockNumber ?? 0
  let upserts: Array<Promise<any>> = []

  while (true) {
    const txs = await getEtherscanTransactions({
      address: address,
      startblock: `${lastBlockNumber}`,
      endblock: "999999999999",
      sort: "asc",
    })

    lastBlockNumber = parseInt(txs[txs.length - 1].blockNumber)
    upserts = []
    for (const tx of txs) {
      upserts.push(
        db.transaction.upsert({
          where: { blockHash: tx.blockHash },
          create: tx as any,
          update: {},
        })
      )
    }

    if (upserts.length === 0) {
      break
    } else {
      await Promise.all(upserts)
    }
  }

  return await db.transaction.findMany({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true, timeStamp: true, gasUsed: true },
  })
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

class EtherscanError extends Error {}

const getEtherscanTransactions = async ({
  address,
  sort,
  startblock,
  endblock,
}: EtherscanTransactionsQuery) => {
  const url = new URL(transactionsURL.toString())
  url.searchParams.set("address", address)
  url.searchParams.set("sort", sort)
  url.searchParams.set("startblock", startblock)
  url.searchParams.set("endblock", endblock)

  await queue.removeTokens(1)

  const response = await fetch(url)
  const { status, message, result } = await response.json()

  if (status !== "1") {
    throw new EtherscanError(message)
  }

  return result
}

const transactionsURL = (() => {
  const url = new URL("https://api.etherscan.io/api")
  const params = {
    module: "account",
    action: "txlist",
    page: "1",
    offset: "10000",
    apikey: process.env.ETHERSCAN_KEY!,
  }
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url
})()
