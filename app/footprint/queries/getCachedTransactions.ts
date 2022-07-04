import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import db from "db"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(async (_ = null, { session }) => {
  const { address } = await session.$getPrivateData()

  return await db.transaction.findMany({
    select: { hash: true, blockNumber: true, gasUsed: true, timeStamp: true, gCO2: true },
    where: { from: address },
    orderBy: { blockNumber: "desc" },
  })
})
