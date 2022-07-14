import { Box, Flex, VStack } from "@chakra-ui/react"
import { SolarHero } from "app/footprint/components/SolarHero"
import { Estimate, getNetworkMegawatts } from "app/footprint/services/ethereumEmissions"
import { GetStaticProps } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import React, { startTransition, useCallback, useState } from "react"
import { useTrack } from "use-analytics"

interface SolarPositiveProps {
  estimates: [Estimate, Estimate]
}

export const getStaticProps: GetStaticProps<SolarPositiveProps> = async () => {
  const estimates = await getNetworkMegawatts()

  return {
    props: { estimates },
  }
}

export const SolarPositive: React.FC<SolarPositiveProps> = ({ estimates }) => {
  const track = useTrack()

  type State = "1connect" | "2greenlist" | "3impact"
  const [state, setState] = useState<State>("1connect")
  type Data = { image: string; debt: number }
  const [data, setData] = useState<Data>({ image: "", debt: 0 })

  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback(
    (s: State) =>
      (data: Partial<Data> = {}) =>
        startTransition(() => {
          track(s)
          setState(s)
          setData((d) => ({ ...d, ...data }))
        }),
    [setState, setData, track]
  )

  return (
    <Layout title="Solar Positive">
      <VStack mt={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <SolarHero estimates={estimates} cta="discover your energy score!" />

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

          <Box
            p={[4, 6, 12]}
            borderRadius="3xl"
            color={state === "3impact" ? "gray.400" : "purple.700"}
            bg={state === "3impact" ? "#1d1e24" : "white"}
            minW={320}
            maxW="3xl"
            boxShadow="xl"
            transition="box-shadow 1s ease-in-out infinite alternate"
            _hover={{ boxShadow: "2xl" }}
          ></Box>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default SolarPositive
