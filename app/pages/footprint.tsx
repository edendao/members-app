import { Box, Flex, VStack } from "@chakra-ui/react"
import { Hero as FootprintHero } from "app/footprint/components/Hero"
import { Estimate, getNetworkEmissions } from "app/footprint/services/networkEmissions"
import { GetStaticProps, Image, dynamic } from "blitz"
import { AbsoluteRadiantBackground, RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import RasterBee from "public/raster-bee.png"
import React from "react"

const FootprintWidget = dynamic(() => import("app/footprint/Widget"))

interface FootprintPageProps {
  emissions: [Estimate, Estimate]
}

export const getStaticProps: GetStaticProps<FootprintPageProps> = async () => {
  const emissions = await getNetworkEmissions()

  return {
    revalidate: 60 * 60, // every hour
    props: { emissions },
  }
}

export const FootprintPage: React.FC<FootprintPageProps> = ({ emissions }) => (
  <Layout>
    <RadiantBackground height={12} width="100%" />

    <VStack mt={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
      <FootprintHero emissions={emissions} />

      <Box
        id="bee"
        position="relative"
        w="100vw"
        minH={["40vh", null, null, "50vh", "70vh", "100vh"]}
        color="white"
        p={0}
      >
        <AbsoluteRadiantBackground />
        <Box position="absolute" top="0" right="0" height="100%">
          <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
        </Box>
      </Box>

      <Flex
        id="widget"
        position="relative"
        overflow="hidden"
        direction="column"
        align="center"
        justify="center"
        w="100vw"
        minH="100vh"
        p={[2, 3, 8, 32]}
        color="white"
      >
        <AbsoluteRadiantBackground />

        {/* <Shimmer position="absolute" bottom={4} left={8}>
            <Link
              isExternal
              href="https://twitter.com/TheEdenDao"
              target="_blank"
              textDecoration="none"
            >
              eden dao
            </Link>
          </Shimmer> */}

        <FootprintWidget />
      </Flex>

      {/* <Frontier id="frontier" /> */}
    </VStack>

    {/* <RadiantBackground width="100%" height={120} position="relative" boxShadow="inset">
        <Shimmer position="absolute" bottom={4} left={8}>
          <Link
            isExternal
            href="https://twitter.com/TheEdenDao"
            target="_blank"
            textDecoration="none"
          >
            eden dao
          </Link>
        </Shimmer>
      </RadiantBackground> */}
  </Layout>
)

export default FootprintPage
