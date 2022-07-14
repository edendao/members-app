import createSession from "app/accounts/mutations/createSession"
import { tryLoadingAnalytics } from "app/core/analytics"
import { Router, invoke } from "blitz"
import every from "lodash/every"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import React from "react"
import { PrivateSession } from "types"
import { AnalyticsProvider } from "use-analytics"
import { useAccount, useDisconnect } from "wagmi"

const EmptySession = { address: "", connector: "" } as const
type Session = PrivateSession | typeof EmptySession

const SessionContext = createContext<Session>(EmptySession)

export const useSession = () => useContext(SessionContext)

export const SessionManager = ({ children }) => {
  const analytics = useMemo(tryLoadingAnalytics, [])
  const { disconnect } = useDisconnect()
  const { data: account } = useAccount()
  const [state, setState] = useState<Session>(EmptySession)

  useEffect(() => {
    const onRouteChange = (url: string) => analytics.page({ url })

    Router.events.on("routeChangeComplete", onRouteChange)
    return () => Router.events.off("routeChangeComplete", onRouteChange)
  }, [analytics])

  useEffect(() => {
    const session = {
      address: account?.address,
      connector: account?.connector?.name,
    } as Session

    if (every(session)) {
      invoke(createSession, session).then(
        ({ address, connector }) => {
          setState({ address, connector } as Session)
          analytics.identify(address, { connector })
        },
        () => {
          disconnect()
          analytics.reset()
          setState(EmptySession)
        }
      )
    }
  }, [account?.address, account?.connector?.name, disconnect, setState, analytics])

  return (
    <AnalyticsProvider instance={analytics}>
      <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
    </AnalyticsProvider>
  )
}

export default SessionManager
