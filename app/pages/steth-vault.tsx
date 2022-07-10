import { Box, VStack } from "@chakra-ui/react"
import { Image, dynamic } from "blitz"
import { AbsoluteRadiantBackground, RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import RasterBee from "public/raster-bee.png"
import React from "react"

const Widget = dynamic(() => import("app/vault/Widget"), { ssr: false })

export const STETHVault: React.FC = () => (
  <Layout title="stETH Vault">
    <VStack mx="auto" px={16} align="center" maxW={1440} spacing={0}>
      <Box id="bee" position="relative" w="100vw" h={[0, null, null, "60vh"]} color="white" p={0}>
        <AbsoluteRadiantBackground />
        <Box position="absolute" top="-500px" right="0" height="100%">
          <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
        </Box>
      </Box>

      <RadiantBackground id="vault" w="100vw" py={64}>
        <Widget mx="auto" />
      </RadiantBackground>
    </VStack>
  </Layout>
)

export default STETHVault
