import { Flex } from "@chakra-ui/react"
import { BlitzPage, dynamic } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
// import { Connector } from "ds/molecules/Connector"
import React from "react"
// import { useTrack } from "use-analytics"

const PhotoBooth = dynamic(() => import("app/orbifier/PhotoBooth"), { ssr: false })

export const Orbifier: BlitzPage = () => {
  // const track = useTrack()

  // type State = "1connect" | "3passport"
  // const [state, setState] = useState<State>("1connect")
  // type Data = { image: string }
  // const [data, setData] = useState<Data>({ image: "" })

  // const setStateTo = useCallback(
  //   (s: State) =>
  //     (data: Partial<Data> = {}) =>
  //       startTransition(() => {
  //         track(s)
  //         setState(s)
  //         setData((d) => ({ ...d, ...data }))
  //       }),
  //   [setState, setData, track]
  // )

  return (
    <Layout title="Orbifier 9000" mt={0}>
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
          w="90vw"
          maxW="2xl"
          mx="auto"
          p={[4, 8, 16]}
          borderRadius="3xl"
          boxShadow="inner"
          bg="white"
          alignItems="center"
          justifyContent="center"
        >
          <PhotoBooth />
        </Flex>
      </Flex>
    </Layout>
  )
}

export default Orbifier
