import { Box, VStack } from "@chakra-ui/react"
import { Frontier } from "app/screens/index/Frontier"
import { Hero } from "app/screens/index/Hero"
import { dynamic } from "blitz"
import { Layout } from "ds/Layout"

const Impact = dynamic(() => import("app/screens/rock-solid-pledge"))

const LandingPage: React.FC = () => {
  return (
    <Layout>
      <Box
        height={24}
        width="100%"
        background="radial-gradient(at 0% 100%, #e0c38e 0%, #464cc9 40%, #7A5CCE 60%, #54b0a2 100%) fixed"
      />

      <VStack mt={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <Hero />
        <Frontier id="frontier" />
        <Impact />
      </VStack>
    </Layout>
  )
}

export default LandingPage
