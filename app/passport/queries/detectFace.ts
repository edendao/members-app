import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { detectFace } from "app/passport/services/pixelme"
import { Middleware, resolver } from "blitz"
import * as z from "zod"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), detectFace)
