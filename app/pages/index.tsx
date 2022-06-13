import { Box, VStack } from "@chakra-ui/react"
import { Image, dynamic, getSession } from "blitz"
import { Ethereum } from "components/index/Ethereum"
import { Hero } from "components/index/Hero"
import Layout from "ds/Layout"
import RasterBee from "public/raster-bee.png"
import { PrivateSession } from "types"

const ImpactEstimator = dynamic(() => import("components/index/ImpactEstimator"))
const Frontier = dynamic(() => import("components/index/Frontier"))

interface IndexProps {
  session: PrivateSession
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const props: IndexProps = {
    session: (await session.$getPrivateData()) as PrivateSession,
  }
  return {
    props,
  }
}

const LandingPage: React.FC<IndexProps> = ({ session }) => {
  return (
    <Layout session={session}>
      <VStack my={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <Hero />
        <Ethereum />

        <Box
          id="bee"
          position="relative"
          w="100vw"
          minH={["20vh", null, null, "50vh", "70vh", "100vh"]}
          color="white"
          p={0}
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
            zIndex="-1"
            className="radiant-bg"
          />
          <Box position="absolute" top="0" right="0" height="100%">
            <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
          </Box>
        </Box>

        <ImpactEstimator />

        <Frontier />
      </VStack>
    </Layout>
  )
}

export default LandingPage
