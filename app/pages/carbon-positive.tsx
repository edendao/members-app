import { Box, Flex, Heading, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react"
import { gCO2toTonYears } from "app/core/numbers"
import { Hero as FootprintHero } from "app/footprint/components/Hero"
import { Estimate, getNetworkEmissions } from "app/footprint/services/networkEmissions"
import { GetStaticProps, Image, dynamic, useRouter } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import CostOfTCO2 from "public/carbonplan-cost-of-tCO2.png"
import React, { startTransition, useCallback, useState } from "react"
import { HiExternalLink } from "react-icons/hi"
import { useTrack } from "use-analytics"

const GreenlistGate = dynamic(() => import("ds/molecules/GreenlistGate"), { ssr: false })
const Estimator = dynamic(() => import("app/footprint/components/Estimator"), { ssr: false })

interface CarbonPositiveProps {
  emissions: [Estimate, Estimate]
}

export const getStaticProps: GetStaticProps<CarbonPositiveProps> = async () => {
  const emissions = await getNetworkEmissions()

  return {
    revalidate: 60 * 60, // every hour
    props: { emissions },
  }
}

export const CarbonPositive: React.FC<CarbonPositiveProps> = ({ emissions }) => {
  const track = useTrack()
  const router = useRouter()

  type State = "1connect" | "2greenlist" | "3impact"
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

  return (
    <Layout title="Carbon Positive">
      <VStack mt={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <FootprintHero emissions={emissions} cta="discover your carbon impact!" />

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
          >
            {state === "1connect" ? (
              <Connector text="discover your impact footprint" next={setStateTo("2greenlist")} />
            ) : state === "2greenlist" ? (
              <GreenlistGate cta="go to IMPACT CALCULATOR" next={setStateTo("3impact")} />
            ) : (
              <VStack align="start" spacing={8} px={[0, 2, 4, 8]}>
                <Estimator
                  next={() => router.push("/steth-vault")}
                  mapping={gCO2toTonYears}
                  symbol="-edn"
                  cta="go positive"
                />

                <VStack align="start" spacing={2} fontSize="sm">
                  <Heading size="xs">How does it work?</Heading>
                  <Text>
                    -edn measures your generational impact on atmospheric carbon &mdash; how much
                    carbon and how long it stays in the atmosphere over 1,000 years.
                  </Text>
                  <OrderedList spacing={2} pl={5}>
                    <ListItem>
                      <strong>
                        More gas = more CO<sub>2</sub> emissions
                      </strong>
                      , proportional to your gas usage based on estimated network emissions on that
                      day.&nbsp;
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
                    <ListItem>
                      <strong>Measures the impact on the carbon cycle</strong> by multiplying by
                      310.16 years&nbsp;
                      <Link
                        fontSize="xs"
                        display="inline-flex"
                        color="gray.500"
                        href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
                        target="_blank"
                        isExternal
                        textDecoration="underline"
                      >
                        learn more w/ (carbon)plan
                        <HiExternalLink />
                      </Link>
                    </ListItem>
                  </OrderedList>
                </VStack>
                <Link
                  display="block"
                  href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
                  target="_blank"
                  isExternal
                  transition="transform 200ms ease-in-out infinite alternate"
                  _hover={{ transform: "scale(1.05)" }}
                >
                  <Image
                    src={CostOfTCO2}
                    alt="Research shows that 1 tCO2e has 310.16 ton•years of impact on the atmosphere"
                  />
                </Link>
              </VStack>
            )}
          </Box>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default CarbonPositive
