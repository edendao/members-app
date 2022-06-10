import Patch from "@patch-technology/patch"
import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, NotFoundError, resolver } from "blitz"
import db, { Transaction } from "db"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), async (hash, { session }) => {
  const { address } = await session.$getPrivateData()
  const tx = await findOrCreateEstimateFor(address, hash)
  return tx.gCO2 as number
})

const findOrCreateEstimateFor = async (
  from: string,
  hash: string,
  select = { hash: true, blockNumber: true, gasUsed: true, timeStamp: true, gCO2: true }
) => {
  let tx = await db.transaction.findFirst({ select, where: { from, hash } })

  if (tx == null) {
    throw new NotFoundError(`${from} ${hash}`)
  }

  if (tx?.gCO2 != null) {
    return tx
  }

  tx = await db.transaction.update({
    select,
    where: { hash },
    data: { gCO2: await estimateEmissions(tx) },
  })

  return tx
}

const patch = new Patch(process.env.PATCH_KEY!)
const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.PATCH_RPS!),
    duration: 1,
  })
)

export const estimateEmissions = async (t: Pick<Transaction, "timeStamp" | "gasUsed">) => {
  const { data } = await queue.removeTokens(1).then(() =>
    patch.estimates.createEthereumEstimate({
      timestamp: new Date(t.timeStamp * 1000).toISOString(),
      gas_used: t.gasUsed,
    })
  )
  return data.mass_g
}
