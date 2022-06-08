import { resolver } from "blitz"
import * as z from "zod"

const CreateSession = z.object({
  walletAddress: z.string(),
  connector: z.string(),
})

export default resolver.pipe(resolver.zod(CreateSession), (session, ctx) => {
  ctx.session.$setPrivateData(session)
})
