import "@fontsource/inter/variable.css"
import "@rainbow-me/rainbowkit/styles.css"

import "./_app.css"

import { ChakraProvider } from "@chakra-ui/react"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { AppProps, dynamic } from "blitz"
import { useWagmi } from "ds/hooks/web3/useWagmi"
import { edenRainbowKitTheme } from "ds/themes"
import { edenChakraTheme } from "ds/themes"
import identity from "lodash/identity"
import React from "react"
import { Toaster } from "react-hot-toast"
import { WagmiConfig } from "wagmi"

const SessionManager = dynamic(() => import("ds/molecules/SessionManager"), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
  const { chains, client } = useWagmi()
  const { getLayout = identity } = Component

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider showRecentTransactions chains={chains} theme={edenRainbowKitTheme}>
        <SessionManager>
          <ChakraProvider theme={edenChakraTheme}>
            {getLayout(
              <>
                <Component {...pageProps} />
                <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
              </>
            )}
          </ChakraProvider>
        </SessionManager>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
