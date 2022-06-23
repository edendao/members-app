import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

export const useWagmi = (() => {
  const { chains, provider } = configureChains(
    [chain.mainnet, chain.rinkeby],
    [
      alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
      publicProvider({ pollingInterval: 10000 }),
    ]
  )

  const { connectors } = getDefaultWallets({ appName: "PROOF OF WORK", chains })
  const client = createClient({ autoConnect: true, connectors, provider })

  return () => ({ chains, provider, connectors, client })
})()
