import { resolver } from "blitz"
import * as z from "zod"

import { detectFace } from "../services/pixelme"

export default resolver.pipe(resolver.zod(z.string()), detectFace)
