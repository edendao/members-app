import { Box } from "@chakra-ui/react"
import Widget from "app/vault/Widget"
import { BlitzPage } from "blitz"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import React from "react"

export const STETHVault: BlitzPage = () => (
  <Layout title="stETH Vault" mt={0}>
    <RadiantBackground id="vault" w="100vw" py={64}>
      <Box mx="auto" maxW={1440}>
        <Widget mx="auto" />
      </Box>
    </RadiantBackground>
  </Layout>
)

export default STETHVault
