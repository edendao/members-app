import * as etherscan from "app/core/etherscan/transactions"
import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import db from "db"
import last from "lodash/last"
import map from "lodash/map"
import { PrivateSession } from "types"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (endblock, { session }) => {
  const { address } = (await session.$getPrivateData()) as PrivateSession
  console.time("database")
  const cached = await db.transaction.findMany({
    where: { from: address },
    orderBy: { blockNumber: "desc" },
    select: { blockNumber: true, hash: true, gasUsed: true, timeStamp: true, gCO2: true },
  })
  console.timeEnd("database")
  const startblock = last(cached)?.blockNumber ?? "0"

  console.time("etherscan")
  const latest = await etherscan.getTransactions({
    address,
    startblock,
    endblock,
    sort: "desc",
  })
  console.timeEnd("etherscan")

  if (latest.length === 0) {
    return cached
  }

  const cache = new Set(map(cached, "hash"))
  const uncached = latest.filter((t) => !cache.has(t.hash))

  await db.transaction.createMany({ data: uncached, skipDuplicates: true })

  return [...uncached, ...cached]
})
