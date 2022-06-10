import { AuthorizationError, Middleware } from "blitz"
import { PrivateSession } from "types"

export const hasConnectedWallet: Middleware = async (_, res, next) => {
  const { address } = (await res.blitzCtx.session.$getPrivateData()) as PrivateSession
  if (!address) {
    throw new AuthorizationError("TEAPOT")
  }

  await next()
}
