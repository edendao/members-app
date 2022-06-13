import { Box, BoxProps, Flex, SlideFade } from "@chakra-ui/react"
import React, { useCallback, useMemo, useState } from "react"
import { useInView } from "react-hook-inview"

import { Connect } from "./0Connect"
import { Estimator } from "./1Estimator"
import { Commit } from "./2Commit"

type State = "0connect" | "1estimating" | "2commit" | "9complete"

export const ImpactEstimator: React.FC<BoxProps> = (props) => {
  const [state, setState] = useState<State>("0connect")
  // For memoizing the `next` callback in component renders
  const stateSetterTo = useCallback((s: State) => () => setState(s), [setState])
  // Use === for type checking
  const isLightTheme = useMemo(() => state === "2commit", [state])

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

  const RadiantBackground = (
    <Box
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      zIndex="-1"
      className="radiant-bg"
    />
  )

  return (
    <Flex
      id="impact"
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
      {VisibilityTarget}

      {RadiantBackground}

      <SlideFade offsetY={20} in={isVisible}>
        <Box
          {...props}
          p={[2, 4, 6, 12]}
          borderRadius="3xl"
          color={isLightTheme ? "purple.700" : "gray.100"}
          bg={isLightTheme ? "white" : "#1d1e23"}
          w="100%"
          minW={320}
          maxW="3xl"
          boxShadow="xl"
          transition="all 1s ease-in-out"
          _hover={{ boxShadow: "2xl" }}
        >
          {state === "0connect" ? (
            <Connect next={stateSetterTo("1estimating")} />
          ) : state === "1estimating" ? (
            <Estimator next={stateSetterTo("2commit")} />
          ) : state === "2commit" ? (
            <Commit next={stateSetterTo("9complete")} />
          ) : null}
        </Box>
      </SlideFade>
    </Flex>
  )
}

export default ImpactEstimator
