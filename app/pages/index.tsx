import { Box, VStack } from "@chakra-ui/react"
import { INPUT_TOKEN, OUTPUT_TOKEN } from "app/core/tokens"
import { Estimate, getNetworkEmissions } from "app/ethereum/queries/getNetworkEmissions"
import { Footprint } from "app/screens/index/Footprint"
import { Hero } from "app/screens/index/Hero"
import { dynamic } from "blitz"
import { Layout } from "ds/Layout"
import React from "react"
import toast from "react-hot-toast"
import { useNetwork } from "wagmi"

const Impact = dynamic(() => import("app/screens/rock-solid-pledge"))
const Frontier = dynamic(() => import("app/screens/index/Frontier"))

export const getServerSideProps = async () => {
  return {
    props: {
      emissions: await getNetworkEmissions(),
    },
  }
}

interface LandingPageProps {
  emissions: [Estimate, Estimate]
}

export const LandingPage: React.FC<LandingPageProps> = ({ emissions }) => {
  const { activeChain } = useNetwork()

  const inputToken = INPUT_TOKEN[activeChain?.id ?? ""]
  const outputToken = OUTPUT_TOKEN[activeChain?.id ?? ""]

  if (activeChain?.id && (!inputToken || !outputToken)) {
    toast.error("Please switch to ETH mainnet.")
  }

  return (
    <Layout>
      <Box
        height={24}
        width="100%"
        background="radial-gradient(at 0% 100%, #e0c38e 0%, #464cc9 40%, #7A5CCE 60%, #54b0a2 100%) fixed"
      />

      <VStack mt={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <Hero emissions={emissions} />
        <Impact inputToken={inputToken} outputToken={outputToken} />
        <Frontier id="frontier" />
      </VStack>
    </Layout>
  )
}

export default LandingPage
