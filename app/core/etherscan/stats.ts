import { etherscan } from "./client"

export interface EthereumPriceResponse {
  status: "0" | "1"
  message: string
  result: {
    ethbtc: string
    ethbtc_timestamp: string
    ethusd: string
    ethusd_timestamp: string
  }
}

export const getEthereumPrice = async () => {
  const { data } = await etherscan.get<EthereumPriceResponse>("api", {
    params: {
      module: "stats",
      action: "ethprice",
    },
  })

  const { status, message, result } = data
  if (status !== "1") {
    throw new Error(`EtherscanError: ${message}`)
  }

  return parseFloat(result.ethusd)
}
