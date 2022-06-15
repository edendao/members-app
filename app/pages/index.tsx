import { Box, VStack } from "@chakra-ui/react"
import { dynamic } from "blitz"
import { Hero } from "components/index/Hero"
import { Layout } from "ds/Layout"

const Impact = dynamic(() => import("components/impact"))

const LandingPage: React.FC = () => {
  return (
    <Layout>
      <Box
        height={24}
        width="100%"
        background="radial-gradient(at 0% 100%, #e0c38e 0%, #464cc9 40%, #7A5CCE 60%, #54b0a2 100%) fixed"
      />

      <VStack my={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <Hero />
        <Impact />
      </VStack>
    </Layout>
  )
}

export default LandingPage
