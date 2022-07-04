import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { User } from "db"

import type { Typist, TypistProps } from "react-typist"

// Note: You should switch to Postgres and then use a DB enum for role type
export type Role = "ADMIN" | "USER"

export type Connectors = "injected" | "walletconnect"
export type Actions = "connected" | "disconnected"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
    }
  }
}

export interface PrivateSession {
  address: string
  connector: Connectors
  lastAction: Actions
}
