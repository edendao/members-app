import { Box, Flex, Heading, VStack } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shimmer } from "ds/atoms/Shimmer"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export const Connector: React.FC<{ next: () => void }> = ({ next }) => {
  const { data: account } = useAccount()

  useEffect(() => {
    if (account?.address) {
      next()
    }
  }, [account?.address, next])

  return (
    <Flex direction="column" align="start">
      <Box>
        <Shimmer size="md">pledge your support to the frontier</Shimmer>
        <Heading size="md">of humanity&rsquo;s historic quest </Heading>
        <Shimmer size="lg" mt={2}>
          to master the carbon arts
        </Shimmer>
      </Box>
      <Box transform="scale(1.5)" mt={6} py={4} pl={8}>
        <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
      </Box>
    </Flex>
  )
}
