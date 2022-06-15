import { getEtherscanTransactions } from "app/core/etherscan"
import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import db from "db"
import last from "lodash/last"
import map from "lodash/map"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (endblock, { session }) => {
  const { address } = await session.$getPrivateData()
  console.time("database")
  const cachedTransactions = await db.transaction.findMany({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true, hash: true, gasUsed: true, timeStamp: true, gCO2: true },
  })
  console.timeEnd("database")
  const startblock = last(cachedTransactions)?.blockNumber ?? "0"

  console.time("etherscan")
  const latestTransactions = await getEtherscanTransactions({
    address,
    startblock,
    endblock,
    sort: "asc",
  }).catch(() => [])
  console.timeEnd("etherscan")

  if (latestTransactions.length === 0) {
    return cachedTransactions
  }

  const cache = new Set(map(latestTransactions, "hash"))
  const newTransactions = latestTransactions.filter((t) => !cache.has(t.hash))

  await db.transaction.createMany({ data: newTransactions })
  return [...newTransactions, ...cachedTransactions]
})
