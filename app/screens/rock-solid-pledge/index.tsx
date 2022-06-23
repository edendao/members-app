import { Box, BoxProps, Flex, SlideFade } from "@chakra-ui/react"
import { Token } from "@uniswap/sdk-core"
import { INPUT_TOKEN, OUTPUT_TOKEN } from "app/core/tokens"
import { Image } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import RasterBee from "public/raster-bee.png"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useInView } from "react-hook-inview"
import { toast } from "react-hot-toast"
import { useNetwork } from "wagmi"

import { Connector } from "./1Connector"
// import { Estimator } from "./1Estimator"
import { Pledger } from "./2Pledger"
import { Estimator } from "./3Estimator"

export const RockSolidPledge: React.FC<BoxProps> = (props) => {
  const { activeChain } = useNetwork()

  const [inputToken, setInputToken] = useState<Token>()
  const [outputToken, setOutputToken] = useState<Token>()

  useEffect(() => {
    if (!activeChain?.id) return

    const chainid = activeChain.id
    if (chainid in INPUT_TOKEN) {
      setInputToken(INPUT_TOKEN[chainid])
      setOutputToken(OUTPUT_TOKEN[chainid])
    } else {
      setInputToken(undefined)
      setOutputToken(undefined)
      toast.error("Please switch to Ethereum mainnet.")
    }
  }, [activeChain?.id])

  type State = "1connect" | "2pledge" | "3estimate" | "4next"
  const [state, setState] = useState<State>("1connect")
  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback((s: State) => () => setState(s), [setState])

  const [isVisibleRef, isVisible] = useInView({ unobserveOnEnter: true })
  const VisibilityTarget = (
    <Box
      ref={isVisibleRef}
      position="absolute"
      bottom="40vh"
      right="50vh"
      w="1"
      h="1"
      zIndex="-1"
    />
  )

  return (
    <>
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

      <Flex
        id="pledge"
        position="relative"
        overflow="hidden"
        direction="column"
        align="center"
        justify="center"
        w="100vw"
        minH="100vh"
        p={[2, null, 32]}
        color="white"
      >
        <AbsoluteRadiantBackground />
        {VisibilityTarget}
        <SlideFade offsetY={20} in={isVisible}>
          <Box
            {...props}
            p={[2, 4, 6, 12]}
            borderRadius="3xl"
            color="purple.700"
            bg="white"
            w="100%"
            minW={320}
            maxW="3xl"
            boxShadow="xl"
            transition="box-shadow 1s ease-in-out infinite alternate"
            _hover={{ boxShadow: "2xl" }}
          >
            {state === "1connect" ? (
              <Connector next={setStateTo("2pledge")} />
            ) : state === "2pledge" ? (
              <Pledger
                next={setStateTo("3estimate")}
                inputToken={inputToken!}
                outputToken={outputToken!}
              />
            ) : state === "3estimate" ? (
              <Estimator
                inputToken={inputToken!}
                outputToken={outputToken!}
                next={setStateTo("4next")}
              />
            ) : null}
          </Box>
        </SlideFade>
      </Flex>
    </>
  )
}

export default RockSolidPledge
