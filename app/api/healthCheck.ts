import { BlitzApiRequest, BlitzApiResponse } from "blitz"

export default function healthCheck(_: BlitzApiRequest, res: BlitzApiResponse) {
  res.statusCode = 200
  res.end()
}
