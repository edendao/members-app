import { getEtherscanTransactions } from "app/core/etherscan"
import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import db from "db"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (endblock, { session }) => {
  const { address } = await session.$getPrivateData()
  const lasttx = await db.transaction.findFirst({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true },
  })
  const startblock = lasttx?.blockNumber ?? "0"
  const txs = await getEtherscanTransactions({ address, startblock, endblock, sort: "asc" })

  if (txs.length !== 0) {
    const cachedTransactions = await db.transaction.findMany({
      where: { from: address },
      select: { hash: true },
    })
    const cachedHashes = new Set(cachedTransactions.map((tx) => tx.hash))
    const newTransactions = txs.filter((tx) => !cachedHashes.has(tx.hash))

    await db.transaction.createMany({ data: newTransactions })
  }

  return await db.transaction.findMany({
    select: { hash: true, blockNumber: true, gasUsed: true, timeStamp: true, gCO2: true },
    where: { from: address },
    orderBy: { blockNumber: "desc" },
  })
})
