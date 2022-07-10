import { resolver } from "blitz"
import * as z from "zod"

import { isGreenlisted } from "../pledge"

export default resolver.pipe(resolver.zod(z.string().nonempty("ADDRESS REQUIRED")), isGreenlisted)
