import { Flex } from "@chakra-ui/react"
import React, { useCallback, useEffect, useState, startTransition } from "react"

import { dynamic } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"

const PhotoBooth = dynamic(() => import("app/orbifier/PhotoBooth"), { ssr: false })

export const Index: React.FC = () => {
  return (
    <Layout title="ReFi Orbifier" mt={0} h="50vh">
      <Flex
        position="relative"
        overflow="hidden"
        direction="column"
        w="100vw"
        px={[2, 3, 4, 8]}
        pt="10vh"
        pb="20vh"
        h="100vh"
      >
        <AbsoluteRadiantBackground />

        <Flex
          minH="100"
          maxH="400"
          w="90vw"
          maxW="2xl"
          mx="auto"
          p={[4, 8, 16]}
          borderRadius="2xl"
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

export default Index
