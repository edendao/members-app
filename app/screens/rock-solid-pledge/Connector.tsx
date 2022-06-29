import { Box, Flex } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Shimmer } from "ds/atoms/Shimmer"
import { useEffect } from "react"
import { GiFootprint } from "react-icons/gi"
import { useAccount } from "wagmi"

export const Connector: React.FC<{ next: () => void }> = ({ next }) => {
  const { data: account } = useAccount()

  useEffect(() => {
    if (account?.address) {
      next()
    }
  }, [account?.address, next])

  return (
    <Flex direction="column" align="center">
      <Shimmer size="md" display="flex">
        discover your carbon footprint&nbsp;&nbsp;
        <Box mt={-1}>
          <GiFootprint />
        </Box>
      </Shimmer>
      <Box transform="scale(1.25)" mt={4} py={4}>
        <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
      </Box>
    </Flex>
  )
}
