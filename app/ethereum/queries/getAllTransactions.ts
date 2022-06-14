import { getEtherscanTransactions } from "app/core/etherscan"
import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import db from "db"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (endblock, { session }) => {
  const { address } = await session.$getPrivateData()
  const cachedTransactions = await db.transaction.findMany({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true, hash: true, gasUsed: true, timeStamp: true, gCO2: true },
  })
  const startblock = cachedTransactions[cachedTransactions.length - 1]?.blockNumber ?? "0"

  const latestTransactions = await getEtherscanTransactions({
    address,
    startblock,
    endblock,
    sort: "asc",
  }).catch(() => [])

  if (latestTransactions.length === 0) {
    return cachedTransactions
  }

  const cachedHashes = new Set(cachedTransactions.map(({ hash }) => hash))
  const newTransactions = latestTransactions.filter(({ hash }) => !cachedHashes.has(hash))

  await db.transaction.createMany({ data: newTransactions })
  return [...newTransactions, ...cachedTransactions]
})
