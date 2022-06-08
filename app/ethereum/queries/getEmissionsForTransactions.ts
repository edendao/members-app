import Patch from "@patch-technology/patch"
import { resolver } from "blitz"
import db, { Transaction } from "db"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"
import * as z from "zod"

const CreateEmissionEstimate = z.array(z.string())

export default resolver.pipe(
  resolver.zod(CreateEmissionEstimate),
  resolver.authorize(),
  async (hashes) => Promise.all(hashes.map(findOrCreateEstimate))
)

const findOrCreateEstimate = async (hash: string) => {
  const tx = await db.transaction.findFirst({
    where: { hash },
    select: { hash: true, blockNumber: true, gasUsed: true, timeStamp: true, gCO2: true },
  })
  if (tx == null) {
    return null
  }

  if (tx?.gCO2 != null) {
    return tx.gCO2
  }

  const gCO2 = await estimateEmissions(tx)
  return await db.transaction.update({
    where: { hash },
    data: { gCO2 },
    select: { hash: true, blockNumber: true, gasUsed: true, timeStamp: true, gCO2: true },
  })
}

const patch = new Patch(process.env.PATCH_KEY!)
const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.PATCH_RPS!),
    duration: 1,
  })
)

const estimateEmissions = async ({
  timeStamp,
  gasUsed,
}: Pick<Transaction, "timeStamp" | "gasUsed">) => {
  await queue.removeTokens(1)
  const r = await patch.estimates.createEthereumEstimate({
    timestamp: new Date(timeStamp),
    gas_used: gasUsed,
  })
  return r.data.mass_g
}
