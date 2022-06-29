import { Box, Flex, SlideFade } from "@chakra-ui/react"
import { Token } from "@uniswap/sdk-core"
import { Image, dynamic } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import RasterBee from "public/raster-bee.png"
import React, { useCallback, useState } from "react"
import { useInView } from "react-hook-inview"

import { Connector } from "./Connector"

const Pledger = dynamic(() => import("./Pledger"))
const Footprint = dynamic(() => import("./Footprint"))

interface RockSolidPledgeProps {
  inputToken: Token
  outputToken: Token
}

export const RockSolidPledge: React.FC<RockSolidPledgeProps> = ({ inputToken, outputToken }) => {
  type State = "1connect" | "2footprint" | "3pledge"
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
            p={[2, 4, 6, 12]}
            borderRadius="3xl"
            color={state === "2footprint" ? "gray.400" : "purple.700"}
            bg={state === "2footprint" ? "#1d1e24" : "white"}
            w="100%"
            minW={320}
            maxW="3xl"
            boxShadow="xl"
            transition="box-shadow 1s ease-in-out infinite alternate"
            _hover={{ boxShadow: "2xl" }}
          >
            {state === "1connect" ? (
              <Connector next={setStateTo("2footprint")} />
            ) : state === "2footprint" ? (
              <Footprint
                next={setStateTo("3pledge")}
                inputToken={inputToken}
                outputToken={outputToken}
              />
            ) : state === "3pledge" ? (
              <Pledger
                back={setStateTo("2footprint")}
                inputToken={inputToken}
                outputToken={outputToken}
              />
            ) : null}
          </Box>
        </SlideFade>
      </Flex>
    </>
  )
}

export default RockSolidPledge
