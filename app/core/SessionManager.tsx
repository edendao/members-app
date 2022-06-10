import createSession from "app/users/mutations/createSession"
import { invoke } from "blitz"
import { createContext, useContext, useEffect, useState } from "react"
import React from "react"
import { PrivateSession } from "types"
import { useAccount, useDisconnect } from "wagmi"

interface Session {
  address: "" | PrivateSession["address"]
  connector: "" | PrivateSession["connector"]
}

const EmptySession = { address: "", connector: "" } as const

const SessionContext = createContext<Session>(EmptySession)

export const useSession = () => useContext(SessionContext)

export const SessionManager = ({ children }) => {
  const { disconnect } = useDisconnect()
  const { data: account } = useAccount()
  const [state, setState] = useState<Session>(EmptySession)

  useEffect(() => {
    let address: string | undefined
    let connector: string | undefined
    if ((address = account?.address) && (connector = account?.connector?.name)) {
      const session = { address, connector }

      invoke(createSession, session).then(
        () => {
          setState(session as any)
        },
        () => {
          disconnect()
          setState(EmptySession)
        }
      )
    }
  }, [account?.address, account?.connector?.name, disconnect, setState])

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
}

export default SessionManager
