import { resolver } from "blitz"
import { PrivateSession } from "types"

export default resolver.pipe(
  async (_ = null, ctx) => (await ctx.session.$getPrivateData()) as PrivateSession
)
