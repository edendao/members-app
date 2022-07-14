import axios from "axios"
import CSV from "papaparse"

export interface Estimate {
  lower: number
  upper: number
  best: number
}

export const getNetworkTCO2 = async (): Promise<[Estimate, Estimate]> => {
  console.time("ethereum-emissions/emissions")
  const response = await axios.get(
    "https://kylemcdonald.github.io/ethereum-emissions/output/daily-ktco2.csv",
    { responseType: "stream" }
  )
  console.timeEnd("ethereum-emissions/emissions")

  return await new Promise((resolve, reject) => {
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
  })
}

export const getNetworkMegawatts = async (): Promise<[Estimate, Estimate]> => {
  console.time("ethereum-emissions/energy")
  const response = await axios.get(
    "https://kylemcdonald.github.io/ethereum-emissions/output/daily-gw.csv",
    { responseType: "stream" }
  )
  console.timeEnd("ethereum-emissions/energy")

  return await new Promise((resolve, reject) => {
    const total: Estimate = { best: 0, lower: 0, upper: 0 }

    const parser = CSV.parse(CSV.NODE_STREAM_INPUT, { header: true, dynamicTyping: true })
    parser.on("error", reject)

    let last: Estimate
    parser.on("data", (day: Estimate) => {
      day.best *= 24
      day.lower *= 24
      day.upper *= 24
      total.best += day.best
      total.lower += day.lower
      total.upper += day.upper
      last = day
    })

    parser.on("finish", () => {
      resolve([last, total])
    })

    response.data.pipe(parser)
  })
}
