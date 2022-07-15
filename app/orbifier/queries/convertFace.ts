import { hasConnectedWallet } from "app/core/middleware/hasConnectedWallet"
import { Middleware, resolver } from "blitz"
import * as z from "zod"

import { convertFace } from "../services/pixelme"

export const middleware: Middleware[] = [hasConnectedWallet]

export default resolver.pipe(resolver.zod(z.string()), convertFace)
