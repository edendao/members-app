import { resolver } from "blitz"

export default resolver.pipe(async (_, ctx) => ctx.session.$revoke())
