import axios from "axios"
import { resolver } from "blitz"
import { getAddress } from "ethers/lib/utils"
import * as z from "zod"

const baseURL = process.env.GREENLIST_API!

export const isGreenlisted = async (address: string) => {
  const { data } = await axios.get(baseURL + getAddress(address))
  if (data.error) {
    throw new Error(data.error)
  }
  return Boolean(data.greenlisted)
}

export default resolver.pipe(resolver.zod(z.string()), isGreenlisted)
