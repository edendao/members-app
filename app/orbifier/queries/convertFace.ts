import { Middleware, resolver } from "blitz"
import * as z from "zod"

import { convertFace } from "../services/pixelme"
export default resolver.pipe(resolver.zod(z.string()), convertFace)
