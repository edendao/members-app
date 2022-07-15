import axios from "axios"
import get from "lodash/fp/get"

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

export const client = axios.create({
  baseURL: "https://pixel-me-api-gateway-cj34o73d6a-an.a.run.app/api/v1/",
  params: { key: "AIzaSyB1icoMXVbxjiAzwBTI_4FufkzTnX78U0s" },
})

export const responseHeader = "data:image/gif;base64,"

export const detectFace = async (dataURI: string) =>
  await client
    .post<DetectFaceResponse>("detect", { image: dataURI.slice(dataURI.indexOf(",") + 1) })
    .then(get("data.data.image"))
    .then((image) => responseHeader + image)

export const convertFace = async (dataURI: string) =>
  await client
    .post<ConvertFaceResponse>("convert/face", { image: dataURI.slice(dataURI.indexOf(",") + 1) })
    .then(get("data.data.images.1.image"))
    .then((image) => responseHeader + image)
