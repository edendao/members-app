import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(async (_ = null, { session: { userId } }) => {
  if (!userId) return null

  return await db.user.findFirst({ where: { id: userId } })
})
