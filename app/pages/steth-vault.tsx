import { VStack } from "@chakra-ui/react"
import Widget from "app/vault/Widget"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import { Layout } from "ds/Layout"
import React from "react"

export const STETHVault: React.FC = () => (
  <Layout title="stETH Vault" mt={0}>
    <VStack mx="auto" px={16} align="center" maxW={1440} spacing={0}>
      <RadiantBackground id="vault" w="100vw" py={64}>
        <Widget mx="auto" />
      </RadiantBackground>
    </VStack>
  </Layout>
)

export default STETHVault
