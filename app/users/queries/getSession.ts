import { Ctx } from "blitz"

export default async function getCurrentUserServer(_ = null, { session }: Ctx) {
  return session.$getPrivateData()
}
