import { Box, VStack } from "@chakra-ui/react"
import { Hero } from "app/components/index/Hero"
import { Estimate, getNetworkEmissions } from "app/core/networkEmissions"
import { GetStaticProps, Image, dynamic } from "blitz"
import { AbsoluteRadiantBackground, RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import RasterBee from "public/raster-bee.png"
import React from "react"

const Frontier = dynamic(() => import("app/components/index/Frontier"))
const Widget = dynamic(() => import("app/components/widget"))

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
  return (
    <Layout>
      <RadiantBackground height={24} width="100%" />

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

        <Widget id="widget" />

        <Frontier id="frontier" />
      </VStack>

      <RadiantBackground height={48} width="100%" />
    </Layout>
  )
}

export default LandingPage
