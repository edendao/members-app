import axios from "axios"
import { resolver } from "blitz"
import CSV from "papaparse"

export default resolver.pipe(() =>
  Date.now() <= Number(updatedAt) + 6 * 60 * 1000 && cachedEstimate.best !== 0
    ? cachedEstimate // cached for 6 hours
    : updateEstimate()
)

export interface Estimate {
  lower: number
  upper: number
  best: number
}

export let cachedEstimate: Estimate = { lower: 0, upper: 0, best: 0 }
export let updatedAt: Date = new Date(0)

export const updateEstimate = async (): Promise<Estimate> => {
  console.time("ethereum emissions")
  const response = await axios.get(
    "https://kylemcdonald.github.io/ethereum-emissions/output/daily-ktco2.csv",
    { responseType: "stream" }
  )
  console.timeEnd("ethereum emissions")

  return (cachedEstimate = await new Promise((resolve, reject) => {
    const total: Estimate = { best: 0, lower: 0, upper: 0 }
    const parser = CSV.parse(CSV.NODE_STREAM_INPUT, { header: true, dynamicTyping: true })
    parser.on("error", reject)
    parser.on("data", (day: Estimate) => {
      total.best += day.best
      total.lower += day.lower
      total.upper += day.upper
    })
    parser.on("finish", () => {
      total.best *= 1000
      total.lower *= 1000
      total.upper *= 1000
      resolve(total)
    })
    response.data.pipe(parser)
  }))
}
