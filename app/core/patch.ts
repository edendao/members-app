import Patch from "@patch-technology/patch"
import { Transaction } from "db"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"

export const patch = new Patch(process.env.PATCH_KEY!)

export const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.PATCH_RPS!),
    duration: 1,
  })
)

export const estimateEthereumTransactionEmissionsGCO2 = async ({
  timeStamp,
  gasUsed,
}: Pick<Transaction, "timeStamp" | "gasUsed">) => {
  await queue.removeTokens(1)
  const { data } = await patch.estimates.createEthereumEstimate({
    timestamp: new Date(timeStamp * 1000).toISOString(),
    gas_used: gasUsed,
  })
  return data.mass_g
}
