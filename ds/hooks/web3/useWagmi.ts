import { getDefaultWallets } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

const { chains, provider } = configureChains(
  [chain.mainnet, chain.rinkeby],
  [
    alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    publicProvider({ pollingInterval: 10000 }),
  ]
)

const { connectors } = getDefaultWallets({ appName: "ROCK SOLID ETH", chains })
const client = createClient({ autoConnect: true, connectors, provider })

export const useWagmi = () => ({ chains, provider, connectors, client })
