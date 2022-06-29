import axios from "axios"
import { resolver } from "blitz"
import CSV from "papaparse"

export const getNetworkEmissions = () =>
  Date.now() <= Number(updatedAt) + 6 * 60 * 1000 && cachedEstimates[0].best !== 0
    ? cachedEstimates // cached for 6 hours
    : updateEstimates()

export default resolver.pipe(getNetworkEmissions)
export interface Estimate {
  lower: number
  upper: number
  best: number
}

export let cachedEstimates: [Estimate, Estimate] = [
  { lower: 0, upper: 0, best: 0 },
  { lower: 0, upper: 0, best: 0 },
]
export let updatedAt: Date = new Date(0)

export const updateEstimates = async (): Promise<[Estimate, Estimate]> => {
  console.time("ethereum emissions")
  const response = await axios.get(
    "https://kylemcdonald.github.io/ethereum-emissions/output/daily-ktco2.csv",
    { responseType: "stream" }
  )
  console.timeEnd("ethereum emissions")

  return (cachedEstimates = await new Promise((resolve, reject) => {
    const total: Estimate = { best: 0, lower: 0, upper: 0 }

    const parser = CSV.parse(CSV.NODE_STREAM_INPUT, { header: true, dynamicTyping: true })
    parser.on("error", reject)

    let last: Estimate
    parser.on("data", (day: Estimate) => {
      day.best *= 1000
      day.lower *= 1000
      day.upper *= 1000
      total.best += day.best
      total.lower += day.lower
      total.upper += day.upper
      last = day
    })

    parser.on("finish", () => {
      resolve([last, total])
    })

    response.data.pipe(parser)
  }))
}
