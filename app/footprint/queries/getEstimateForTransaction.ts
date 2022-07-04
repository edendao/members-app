import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { estimateEthereumTransactionEmissionsGCO2 } from "app/core/patch"
import { Middleware, NotFoundError, resolver } from "blitz"
import db from "db"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (hash: string, { session }) => {
  const tx = await db.transaction.findFirst({
    where: { hash },
    select: { gCO2: true, timeStamp: true, gasUsed: true },
  })

  if (tx == null) {
    throw new NotFoundError(hash)
  }

  if (tx.gCO2 != null) {
    return tx.gCO2
  }

  console.time("patch")
  const gCO2 = await estimateEthereumTransactionEmissionsGCO2(tx)
  console.timeEnd("patch")
  await db.transaction.update({ where: { hash }, data: { gCO2 } })

  return gCO2
})
