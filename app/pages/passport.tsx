import { Box, Flex, VStack } from "@chakra-ui/react"
import { Hero as FootprintHero } from "app/footprint/components/Hero"
import { Estimate, getNetworkEmissions } from "app/footprint/services/networkEmissions"
import { GetStaticProps, Image, dynamic, useRouter } from "blitz"
import { AbsoluteRadiantBackground, RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import RasterBee from "public/raster-bee.png"
import React, { startTransition, useCallback, useState } from "react"

interface PassportProps {
  emissions: [Estimate, Estimate]
}

export const getStaticProps: GetStaticProps<PassportProps> = async () => {
  const emissions = await getNetworkEmissions()

  return {
    revalidate: 60 * 60, // every hour
    props: { emissions },
  }
}

export const Passport: React.FC<PassportProps> = ({ emissions }) => {
  type State = "1connect" | "2greenlist" | "3passport"
  type Data = { image: string; debt: number }
  const [state, setState] = useState<State>("1connect")
  const [data, setData] = useState<Data>({})
  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback(
    (s: State) =>
      (data: Partial<Data> = {}) =>
        startTransition(() => {
          setState(s)
          setData((d) => ({ ...d, ...data }))
        }),
    [setState, setData]
  )

  return (
    <Layout title="Passport">
      <RadiantBackground height={12} width="100%" />

      <VStack mt={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <FootprintHero emissions={emissions} cta="discover your carbon footprint!" />

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
        ></Flex>
      </VStack>
    </Layout>
  )
}

export default Passport
