import { resolver } from "blitz"

export default resolver.pipe((_ = null, ctx) => ctx.session.$getPrivateData())
