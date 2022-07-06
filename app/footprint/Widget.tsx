import { Box, BoxProps } from "@chakra-ui/react"
import { Connector } from "app/components/Connector"
import { dynamic, useRouter } from "blitz"
import React, { startTransition, useCallback, useState } from "react"

const GreenlistGate = dynamic(() => import("app/components/GreenlistGate"))
const Footprint = dynamic(() => import("./components/Footprint"))

interface WidgetProps extends BoxProps {}

export const Widget: React.FC<WidgetProps> = (boxProps) => {
  type State = "1connect" | "2greenlist" | "3footprint"
  type Data = { image: string; debt: number }
  const [state, setState] = useState<State>("1connect")
  const [data, setData] = useState<Data>({ image: "", debt: 0 })
  // For memoizing the `next` callback in component renders
  const setStateTo = useCallback(
    (s: State) =>
      (data: Partial<Data> = {}) =>
        startTransition(() => {
          setState(s)
          setData((d) => ({ ...d, ...data }))
        }),
    [setState, setData]
  )

  const router = useRouter()

  return (
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
      {...boxProps}
    >
      {state === "1connect" ? (
        <Connector text="discover your carbon footprint" next={setStateTo("2greenlist")} />
      ) : state === "2greenlist" ? (
        <GreenlistGate cta="go to FOOTPRINT CALCULATOR" next={setStateTo("3footprint")} />
      ) : (
        <Footprint next={() => router.push("/steth")} />
      )}
    </Box>
  )
}

export default Widget
