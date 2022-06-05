import { resolver } from "blitz"

interface Session {
  walletAddress: string
  connector: string
}

export default resolver.pipe((session: Session, ctx) => ctx.session.$setPrivateData(session))