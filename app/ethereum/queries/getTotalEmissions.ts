import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import Papa from "papaparse"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(async (_) => await getTotalEmissions())

export const getTotalEmissions = async () => {
  interface Estimate {
    lower: number
    upper: number
    best: number
  }

  const dailyTotalTCO2: Estimate[] = await new Promise((resolve, reject) =>
    Papa.parse("https://kylemcdonald.github.io/ethereum-emissions/output/daily-ktco2.csv" as any, {
      download: true,
      header: true,
      error: reject,
      complete: (result) => resolve(result as unknown as Estimate[]),
    })
  )

  const sums = { lower: 0, upper: 0, best: 0 }
  for (const { lower, upper, best } of dailyTotalTCO2) {
    sums.best += best
    sums.lower += lower
    sums.upper += upper
  }
  return sums
}
