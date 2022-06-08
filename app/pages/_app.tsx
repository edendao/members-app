import "./_app.css"

import { ChakraProvider } from "@chakra-ui/react"
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit"
import { edenChakraTheme, edenRainbowKitTheme } from "app/ds/themes"
import {
  AppProps,
  AuthenticationError,
  AuthorizationError,
  ErrorBoundary,
  ErrorComponent,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import React from "react"
import { Toaster } from "react-hot-toast"
import { WagmiConfig, chain, configureChains, createClient } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
)

const { connectors } = getDefaultWallets({ appName: "PROOF OF WORK", chains })

const wagmiClient = createClient({ autoConnect: true, connectors, provider })

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} showRecentTransactions theme={edenRainbowKitTheme}>
        <ChakraProvider theme={edenChakraTheme}>
          <ErrorBoundary
            FallbackComponent={RootErrorFallback}
            onReset={useQueryErrorResetBoundary().reset}
          >
            {getLayout(
              <>
                <Component {...pageProps} />
                <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
              </>
            )}
          </ErrorBoundary>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

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
