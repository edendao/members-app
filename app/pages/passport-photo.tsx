import { Flex, VStack } from "@chakra-ui/react"
import { dynamic } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import React, { startTransition, useCallback, useState } from "react"

const GreenlistGate = dynamic(() => import("ds/molecules/GreenlistGate"), { ssr: false })
const PhotoBooth = dynamic(() => import("app/passport/components/PhotoBooth"), { ssr: false })

export const PassportPhoto: React.FC = ({}) => {
  type State = "1connect" | "2greenlist" | "3passport"
  type Data = { image: string }
  const [state, setState] = useState<State>("1connect")
  const [data, setData] = useState<Data>({ image: "" })
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

  return (
    <Layout title="Passport" mt={0}>
      <Flex
        position="relative"
        overflow="hidden"
        direction="column"
        w="100vw"
        px={[2, 3, 4, 8]}
        pt="10vh"
        pb="20vh"
      >
        <AbsoluteRadiantBackground />

        <Flex
          minH="500"
          w="90vh"
          maxW="2xl"
          mx="auto"
          p={[4, 8, 16]}
          borderRadius="3xl"
          boxShadow="inner"
          bg="white"
          alignItems="center"
          justifyContent="center"
        >
          {state === "1connect" ? (
            <Connector next={setStateTo("2greenlist")} />
          ) : state === "2greenlist" ? (
            <GreenlistGate next={setStateTo("3passport")} cta="go to PHOTO BOOTH" />
          ) : (
            <PhotoBooth />
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}

export default PassportPhoto
