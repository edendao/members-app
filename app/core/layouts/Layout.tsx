import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from "@ethersproject/providers"
import { Web3ReactProvider } from "@web3-react/core"
import { Head } from "blitz"
import React from "react"

type LayoutProps = {
  title?: string
  session: Record<any, any>
}

const getLibrary = (provider: ExternalProvider | JsonRpcFetchFunc) => {
  const library = new Web3Provider(provider)
  return library
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "wallet-connect"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
    </>
  )
}

export default Layout
