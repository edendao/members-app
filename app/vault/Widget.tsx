import { Box, BoxProps } from "@chakra-ui/react"
import { INPUT_TOKEN, OUTPUT_TOKEN } from "app/core/tokens"
import { dynamic } from "blitz"
import { Connector } from "ds/molecules/Connector"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { useNetwork } from "wagmi"

const Depositor = dynamic(() => import("./Depositor"))

export const Vault: React.FC<BoxProps> = (boxProps) => {
  const { activeChain } = useNetwork()

  const inputToken = INPUT_TOKEN[activeChain?.id ?? ""]
  const outputToken = OUTPUT_TOKEN[activeChain?.id ?? ""]

  if (activeChain?.id && (!inputToken || !outputToken)) {
    toast.error("Please switch to ETH mainnet.")
  }

  type State = "1connect" | "2vault"
  const [state, setState] = useState<State>("1connect")
  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback((s: State) => () => setState(s), [setState])

  return (
    <Box
      p={[4, 6, 12]}
      borderRadius="3xl"
      color="purple.700"
      bg="white"
      w="100%"
      minW="320"
      maxW="3xl"
      {...boxProps}
    >
      {state === "1connect" ? (
        <Connector text="discover your carbon footprint" next={setStateTo("2vault")} />
      ) : !inputToken || !outputToken ? null : state === "2vault" ? (
        <Depositor inputToken={inputToken} outputToken={outputToken} />
      ) : null}
    </Box>
  )
}

export default Vault
