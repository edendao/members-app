import { Box, Flex, Heading, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react"
import { CarbonHero } from "app/footprint/components/CarbonHero"
import { Estimate, getNetworkTCO2 } from "app/footprint/services/ethereumEmissions"
import { Link as BlitzLink, BlitzPage, GetStaticProps, Routes, dynamic, useRouter } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import React, { startTransition, useCallback, useState } from "react"
import { HiExternalLink } from "react-icons/hi"
import { useTrack } from "use-analytics"

import { gCO2toTCO2 } from "../core/carbon"

const Estimator = dynamic(() => import("app/footprint/components/Estimator"), { ssr: false })

interface NetZeroProps {
  emissions: [Estimate, Estimate]
}

export const getStaticProps: GetStaticProps<NetZeroProps> = async () => {
  const emissions = await getNetworkTCO2()

  return {
    revalidate: 60 * 60, // every hour
    props: { emissions },
  }
}

export const NetZero: BlitzPage<NetZeroProps> = ({ emissions }) => {
  const track = useTrack()

  type State = "1connect" | "2greenlist" | "3footprint"
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

  const router = useRouter()

  return (
    <Layout title="Net Zero">
      <VStack mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <CarbonHero estimates={emissions} cta="discover your carbon footprint!" />

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
            ) : (
              <VStack align="start" spacing={8} px={[0, 2, 4, 8]}>
                <Estimator
                  next={({ debt }: { debt: number }) =>
                    window.open(
                      `https://app.klimadao.finance/#/offset?quantity=${debt}&retirementToken=mco2&message=EdenDao`
                    )
                  }
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
                    This measures your carbon footprint &mdash; that is, how many tons of CO
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
                    <BlitzLink href={Routes.CarbonPositive().pathname} passHref>
                      <Link textDecoration="underline">impact on our carbon system</Link>
                    </BlitzLink>
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

export default NetZero
