import { Box, BoxProps, Flex, SlideFade } from "@chakra-ui/react"
import { Token } from "@uniswap/sdk-core"
import { Image } from "blitz"
import RasterBee from "public/raster-bee.png"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useInView } from "react-hook-inview"
import { toast } from "react-hot-toast"
import { chain, useNetwork } from "wagmi"

import { Connect } from "./0Connect"
import { Estimator } from "./1Estimator"
import { Commit } from "./2Commit"
import { Frontier } from "./Frontier"

type State = "0connect" | "1estimating" | "2commit" | "9complete"

const tokenForChain = {
  [chain.mainnet.id]: new Token(
    chain.mainnet.id,
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    18,
    "stETH",
    "Lido Staked ETH"
  ),
  [chain.rinkeby.id]: new Token(
    chain.rinkeby.id,
    "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    18,
    "wETH",
    "Wrapped ETH"
  ),
} as const

const contractForChain = {
  [chain.mainnet.id]: "0x0000000000000000000000000000000000000000",
  [chain.rinkeby.id]: "0x0000000000000000000000000000000000000000",
} as const

export const Impact: React.FC<BoxProps> = (props) => {
  const { activeChain } = useNetwork()

  const [token, setToken] = useState<Token>()
  const [contractAddress, setContractAddress] = useState<string>()

  useEffect(() => {
    const chainid = activeChain?.id
    if (chainid && chainid in tokenForChain) {
      setToken(tokenForChain[chainid])
      setContractAddress(contractForChain[chainid])
    } else {
      setToken(undefined)
      setContractAddress(undefined)
      toast.error("Please switch to Ethereum Mainnet.")
    }
  }, [activeChain?.id])

  const [state, setState] = useState<State>("0connect")
  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback((s: State) => () => setState(s), [setState])
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
        {RadiantBackground}
        <Box position="absolute" top="0" right="0" height="100%">
          <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
        </Box>
      </Box>

      <Flex
        id="commit"
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
        {RadiantBackground}
        {VisibilityTarget}
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
            transition="box-shadow 1s ease-in-out"
            _hover={{ boxShadow: "2xl" }}
          >
            {state === "0connect" ? (
              <Connect next={setStateTo("1estimating")} />
            ) : state === "1estimating" ? (
              <Estimator next={setStateTo("2commit")} />
            ) : state === "2commit" ? (
              <Commit
                next={setStateTo("9complete")}
                token={token!}
                contractAddress={contractAddress!}
              />
            ) : null}
          </Box>
        </SlideFade>
      </Flex>

      <Frontier />
    </>
  )
}

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

export default Impact
