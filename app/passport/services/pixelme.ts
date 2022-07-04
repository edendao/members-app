import axios, { AxiosResponse } from "axios"

export interface Meta {
  status: string
  processing_time: string
}

export interface DetectFaceResponse {
  meta: Meta
  data: {
    image: string
    height: number
    width: number
  }
}
export interface ConvertFaceResponse {
  meta: Meta
  data: {
    images: [
      { image: string; label: "128x128" },
      { image: string; label: "64x64" },
      { image: string; label: "48x48" },
      { image: string; label: "32x32" }
    ]
    qrcode: string
  }
}

export const APIClient = axios.create({ baseURL: "/api/pixelme/" })
export const PixelMeClient = axios.create({
  baseURL: "https://pixel-me-api-gateway-cj34o73d6a-an.a.run.app/api/v1/",
  params: { key: "AIzaSyB1icoMXVbxjiAzwBTI_4FufkzTnX78U0s" },
})

export const client = typeof window === "undefined" ? PixelMeClient : APIClient

const unwrap = <T>(r: AxiosResponse<T>): T => r.data

export const detectFace = (image: string) =>
  client.post<DetectFaceResponse>("detect", { image }).then(unwrap)

export const convertFace = (image: string) =>
  client.post<ConvertFaceResponse>("convert/face", { image }).then(unwrap)
