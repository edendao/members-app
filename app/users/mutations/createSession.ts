import { resolver } from "blitz"
import { getAddress } from "ethers/lib/utils"
import * as z from "zod"

const CreateSession = z.object({
  address: z.string(),
  connector: z.string(),
})

export default resolver.pipe(resolver.zod(CreateSession), ({ address, connector }, ctx) => {
  const session = {
    address: getAddress(address),
    connector,
  }

  ctx.session.$setPrivateData(session)

  return session
})
