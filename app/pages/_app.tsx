import "@fontsource/inter/variable.css"
import "@rainbow-me/rainbowkit/styles.css"

import "./_app.css"

import { ChakraProvider } from "@chakra-ui/react"
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorBoundary,
  ErrorComponent,
  ErrorFallbackProps,
  dynamic,
  useQueryErrorResetBoundary,
} from "blitz"
import { edenRainbowKitTheme } from "ds/themes"
import { edenChakraTheme } from "ds/themes"
import React from "react"
import { Toaster } from "react-hot-toast"
import { WagmiConfig, chain, configureChains, createClient } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const SessionManager = dynamic(() => import("app/core/SessionManager"))

export default function App({ Component, pageProps }: AppProps) {
  const { chains, client } = useEther()
  const getLayout = Component.getLayout ?? ((page) => page)
  const { reset: resetError } = useQueryErrorResetBoundary()

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider showRecentTransactions chains={chains} theme={edenRainbowKitTheme}>
        <SessionManager>
          <ChakraProvider theme={edenChakraTheme}>
            <ErrorBoundary FallbackComponent={RootErrorFallback} onReset={resetError}>
              {getLayout(
                <>
                  <Component {...pageProps} />
                  <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
                </>
              )}
            </ErrorBoundary>
          </ChakraProvider>
        </SessionManager>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

const useEther = (() => {
  const { chains, provider } = configureChains(
    [chain.mainnet, chain.rinkeby],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
  )

  const { connectors } = getDefaultWallets({ appName: "PROOF OF WORK", chains })
  const client = createClient({ autoConnect: true, connectors, provider })

  return () => ({ chains, provider, connectors, client })
})()

const RootErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  if (error instanceof AuthenticationError) {
    return <ErrorComponent statusCode={error.statusCode} title="Please connect your wallet" />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
