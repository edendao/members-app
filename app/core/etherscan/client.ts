import axios from "axios"
import { RateLimiterMemory, RateLimiterQueue } from "rate-limiter-flexible"

const queue = new RateLimiterQueue(
  new RateLimiterMemory({
    points: parseInt(process.env.ETHERSCAN_RPS!),
    duration: 1,
  })
)

const etherscan = axios.create({
  baseURL: "https://api.etherscan.io/",
  params: { apikey: process.env.ETHERSCAN_KEY! },
})

etherscan.interceptors.request.use(async (request) => {
  await queue.removeTokens(1)
  return request
})

export { etherscan }
