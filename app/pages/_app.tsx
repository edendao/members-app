import "@fontsource/inter/variable.css"
import "@rainbow-me/rainbowkit/styles.css"

import "./_app.css"

import { ChakraProvider } from "@chakra-ui/react"
import { AppProps, dynamic } from "blitz"
import { edenChakraTheme } from "ds/themes"
import identity from "lodash/identity"
import React from "react"
import { Toaster } from "react-hot-toast"

export default function App({ Component, pageProps }: AppProps) {
  const { getLayout = identity } = Component

  return (
      <ChakraProvider theme={edenChakraTheme}>
        {getLayout(
          <>
            <Component {...pageProps} />
            <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
          </>
        )}
      </ChakraProvider>
  )
}
