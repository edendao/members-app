import axios, { AxiosError } from "axios"
import { getAddress } from "ethers/lib/utils"

export const url = process.env.BLITZ_PUBLIC_PLEDGE_URL!

export const open = () => {
  window.open(url, "_blank")
}

export const serverURL = process.env.BLITZ_PUBLIC_PLEDGE_SERVER!

export const isGreenlisted = async (address: string) => {
  try {
    const { data } = await axios.get(serverURL + "/greenlist/" + getAddress(address))
    if (data.error) {
      throw new Error(data.error)
    }
    return Boolean(data.greenlisted)
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(error.toJSON())
    } else {
      console.error(error)
    }
    return false
  }
}
