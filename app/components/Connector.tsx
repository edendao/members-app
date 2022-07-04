import { Box, HStack, VStack } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shimmer } from "ds/atoms/Shimmer"
import { useEffect } from "react"
import { GiFootprint } from "react-icons/gi"
import { useAccount } from "wagmi"

interface ConnectorProps {
  next: () => void
  text: string
}

export const Connector: React.FC<ConnectorProps> = ({ text, next }) => {
  const { data: account } = useAccount()

  useEffect(() => {
    if (account?.address) {
      next()
    }
  }, [account?.address, next])

  return (
    <HStack spacing={0} justify="center" py={8}>
      <Box color="purple.700" transform="rotate(-50deg)" mt={-6}>
        <GiFootprint size={128} />
      </Box>
      <VStack mt={6} textAlign="center">
        <Shimmer size="md" display="flex" maxW={280}>
          {text}&nbsp;&nbsp;
        </Shimmer>
        <Box transform="scale(1.25)" mt={4} py={4}>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
        </Box>
      </VStack>
      <Box color="purple.700" transform="scale(-1, 1) rotate(-70deg)" mt={-8}>
        <GiFootprint size={128} />
      </Box>
    </HStack>
  )
}
