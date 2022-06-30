import { Box, BoxProps } from "@chakra-ui/react"
import { INPUT_TOKEN, OUTPUT_TOKEN } from "app/core/tokens"
import { dynamic } from "blitz"
import React, { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { useNetwork } from "wagmi"

import { Connector } from "./Connector"

const Pledger = dynamic(() => import("./Pledger"))
const Footprint = dynamic(() => import("./Footprint"))

export const Widget: React.FC<BoxProps> = (boxProps) => {
  const { activeChain } = useNetwork()

  const inputToken = INPUT_TOKEN[activeChain?.id ?? ""]
  const outputToken = OUTPUT_TOKEN[activeChain?.id ?? ""]

  if (activeChain?.id && (!inputToken || !outputToken)) {
    toast.error("Please switch to ETH mainnet.")
  }

  type State = "1connect" | "2footprint" | "3pledge"
  const [state, setState] = useState<State>("1connect")
  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback((s: State) => () => setState(s), [setState])

  return (
    <Box
      p={[4, 6, 12]}
      borderRadius="3xl"
      color={state === "2footprint" ? "gray.400" : "purple.700"}
      bg={state === "2footprint" ? "#1d1e24" : "white"}
      w="100%"
      minW={320}
      maxW="3xl"
      boxShadow="xl"
      transition="box-shadow 1s ease-in-out infinite alternate"
      _hover={{ boxShadow: "2xl" }}
      {...boxProps}
    >
      {state === "1connect" ? (
        <Connector next={setStateTo("2footprint")} />
      ) : !inputToken || !outputToken ? null : state === "2footprint" ? (
        <Footprint next={setStateTo("3pledge")} inputToken={inputToken} outputToken={outputToken} />
      ) : state === "3pledge" ? (
        <Pledger
          back={setStateTo("2footprint")}
          inputToken={inputToken}
          outputToken={outputToken}
        />
      ) : null}
    </Box>
  )
}

export default Widget
