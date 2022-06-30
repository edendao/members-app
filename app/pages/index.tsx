import { Box, VStack } from "@chakra-ui/react"
import { Hero } from "app/components/index/Hero"
import Widget from "app/components/widget"
import { Estimate, getNetworkEmissions } from "app/core/networkEmissions"
import { INPUT_TOKEN, OUTPUT_TOKEN } from "app/core/tokens"
import { GetStaticProps, Image, dynamic } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import RasterBee from "public/raster-bee.png"
import React from "react"
import toast from "react-hot-toast"
import { useNetwork } from "wagmi"

const Frontier = dynamic(() => import("app/components/index/Frontier"))

export const getStaticProps: GetStaticProps = async () => {
  return {
    revalidate: 60 * 60, // every hour
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
        <Box
          id="bee"
          position="relative"
          w="100vw"
          minH={["20vh", null, null, "50vh", "70vh", "100vh"]}
          color="white"
          p={0}
        >
          <AbsoluteRadiantBackground />
          <Box position="absolute" top="0" right="0" height="100%">
            <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
          </Box>
        </Box>
        <Widget id="widget" inputToken={inputToken} outputToken={outputToken} />
        <Frontier id="frontier" />
      </VStack>
    </Layout>
  )
}

export default LandingPage
