import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect } from "react"
import { useAccount } from "wagmi"

export const Connect: React.FC<{ next: () => void }> = ({ next }) => {
  const { data: account } = useAccount()

  useEffect(() => {
    if (account?.address) {
      next()
    }
  }, [account?.address, next])

  return (
    <VStack spacing={8}>
      <Box textAlign="center">
        <Heading fontWeight="normal" fontFamily="cursive" as="h3" size="lg">
          what&rsquo;s your mark on the world?
        </Heading>
        <Text fontSize="lg">
          Estimate your atmospheric carbon impact from Ethereum&rsquo;s Proof of Work.
        </Text>
        <Text fontSize="sm" color="gray.500">
          We use{" "}
          <Link isExternal textDecoration="underline">
            Etherscan to list transactions
          </Link>{" "}
          and{" "}
          <Link isExternal textDecoration="underline">
            Patch to estimate emissions
          </Link>
          .
        </Text>
      </Box>
      <Box transform="scale(1.1)">
        <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
      </Box>
    </VStack>
  )
}
