import { resolver } from "blitz"

interface Session {
  walletAddress: string
  connector: string
}

export default resolver.pipe(async (session: Session, ctx) => {
  return await ctx.session.$setPrivateData(session)
})
