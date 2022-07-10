import { Box, Flex, Heading, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react"
import { Hero as FootprintHero } from "app/footprint/components/Hero"
import { Estimate, getNetworkEmissions } from "app/footprint/services/networkEmissions"
import { GetStaticProps, dynamic, useRouter } from "blitz"
import { AbsoluteRadiantBackground, RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import React, { startTransition, useCallback, useState } from "react"
import { HiExternalLink } from "react-icons/hi"
import { useTrack } from "use-analytics"

import { gCO2toTCO2 } from "../core/numbers"

const GreenlistGate = dynamic(() => import("ds/molecules/GreenlistGate"))
const Estimator = dynamic(() => import("app/footprint/components/Estimator"))

interface CarbonFootprintProps {
  emissions: [Estimate, Estimate]
}

export const getStaticProps: GetStaticProps<CarbonFootprintProps> = async () => {
  const emissions = await getNetworkEmissions()

  return {
    revalidate: 60 * 60, // every hour
    props: { emissions },
  }
}

export const CarbonFootprint: React.FC<CarbonFootprintProps> = ({ emissions }) => {
  const track = useTrack()

  type State = "1connect" | "2greenlist" | "3footprint"
  type Data = { image: string; debt: number }
  const [state, setState] = useState<State>("1connect")
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

  const router = useRouter()

  return (
    <Layout title="Net Zero">
      <VStack mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <FootprintHero emissions={emissions} cta="discover your carbon footprint!" />

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
            color={state === "3footprint" ? "gray.400" : "purple.700"}
            bg={state === "3footprint" ? "#1d1e24" : "white"}
            minW={320}
            maxW="3xl"
            boxShadow="xl"
            transition="box-shadow 1s ease-in-out infinite alternate"
            _hover={{ boxShadow: "2xl" }}
          >
            {state === "1connect" ? (
              <Connector text="discover your carbon footprint" next={setStateTo("2greenlist")} />
            ) : state === "2greenlist" ? (
              <GreenlistGate cta="go to FOOTPRINT CALCULATOR" next={setStateTo("3footprint")} />
            ) : (
              <VStack align="start" spacing={8} px={[0, 2, 4, 8]}>
                <Estimator
                  next={() => router.push("/steth-vault")}
                  mapping={gCO2toTCO2}
                  cta="rock solid offsets"
                  symbol={
                    <>
                      tCO<sub>2</sub>
                    </>
                  }
                />

                <VStack align="start" spacing={4} fontSize="sm">
                  <Heading size="xs">How does it work?</Heading>
                  <Text>
                    this measures your carbon footprint &mdash; that is, how many tons of CO
                    <sub>2</sub> you have emitted in the atmosphere.
                  </Text>
                  <OrderedList spacing={2} pl={5}>
                    <ListItem>
                      <strong>
                        More gas = more CO<sub>2</sub>
                      </strong>
                      , given your share of Ethereum&rsquo;s emissions&nbsp;
                      <Link
                        fontSize="xs"
                        display="inline-flex"
                        color="gray.500"
                        isExternal
                        textDecoration="underline"
                        target="_blank"
                        href="https://patchtech.notion.site/Patch-Crypto-Carbon-Accounting-Methodology-f25e2a8dd34e4f55bbd92c9ee38516f9"
                      >
                        learn more w/ Patch.io
                        <HiExternalLink />
                      </Link>
                    </ListItem>
                  </OrderedList>
                  <Text fontSize="xs">
                    It is not the most accurate measure of your{" "}
                    <Link href="/impact" textDecoration="underline">
                      impact on our carbon system
                    </Link>
                    .
                  </Text>
                </VStack>
              </VStack>
            )}
          </Box>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default CarbonFootprint
