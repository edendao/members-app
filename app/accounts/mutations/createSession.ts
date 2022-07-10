import { resolver } from "blitz"
import { getAddress } from "ethers/lib/utils"
import * as z from "zod"

const CreateSession = z.object({
  address: z.string(),
  connector: z.string(),
})

export default resolver.pipe(resolver.zod(CreateSession), async ({ address, connector }, ctx) => {
  const session = {
    address: getAddress(address),
    connector,
  }

  await ctx.session.$setPrivateData(session)

  return session
})
