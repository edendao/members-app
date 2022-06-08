import { resolver } from "blitz"
import { sum } from "lodash"
import sumBy from "lodash/sumBy"
import Papa from "papaparse"

export const getTotalEmissions = async () => {
  interface Estimate {
    lower: number
    upper: number
    best: number
  }

  const dailyTotalTCO2: Estimate[] = await new Promise((resolve, reject) =>
    Papa.parse("https://kylemcdonald.github.io/ethereum-emissions/output/daily-ktco2.csv", {
      download: true,
      header: true,
      error: reject,
      complete: resolve,
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

export default resolver.pipe(async (_) => await getTotalEmissions())
