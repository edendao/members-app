import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Fraction, Token } from "@uniswap/sdk-core"
import { gCO2toTonYears } from "app/core/carbon-math"
import { useERC20BalanceOf } from "app/core/hooks/web3/useERC20"
import { toTokenAmount } from "app/core/tokens"
import getCachedTransactions from "app/ethereum/queries/getCachedTransactions"
import { useQuery } from "blitz"
import sumBy from "lodash/sumBy"
import React, { useMemo } from "react"
import { GiFireAce, GiHeartWings, GiSpiralBottle, GiStripedSun } from "react-icons/gi"
import { useAccount } from "wagmi"

import { HowItWorks } from "./components/HowItWorks"
import { LidoVault } from "./components/LidoVault"

interface DepositorProps {
  next: () => void
  inputToken: Token
  outputToken: Token
}

export const Pledger: React.FC<DepositorProps> = ({ inputToken, outputToken, next }) => {
  const { data: account } = useAccount()
  const { data: balanceOf } = useERC20BalanceOf(outputToken.address, account?.address)
  const edenETHBalance = toTokenAmount(outputToken, balanceOf)

  return (
    <VStack spacing={6} p={[4, null, 8]} align="start">
      {/* <Estimator token={token} next={() => {}} mb={8} /> */}
      {edenETHBalance && edenETHBalance.greaterThan(new Fraction(1, 100)) && (
        <Box pb={4}>
          <Alert status="success" borderRadius="lg" color="green.800" fontSize="lg">
            <Text mr={2} fontWeight="bold">
              🌱&nbsp;&nbsp;hello again, pledge! you have {edenETHBalance.toSignificant(4)}{" "}
              {outputToken.symbol}.
            </Text>
          </Alert>
        </Box>
      )}
      <Heading
        fontFamily="cursive"
        fontWeight="normal"
        as="h2"
        size="lg"
        lineHeight={1}
        my={0}
        display="inline-flex"
      >
        rock solid impact pledge
      </Heading>
      <List fontSize="xl" display="flex" flexDirection="column" alignItems="start" spacing={4}>
        <ListItem display="flex" alignItems="center">
          <ListIcon as={GiHeartWings} boxSize={12} mr={4} />
          Level up humanity for the public good
        </ListItem>
        <ListItem display="flex" alignItems="center">
          <ListIcon as={GiSpiralBottle} boxSize={12} mr={4} />
          <Link
            href="#frontier"
            textDecoration="underline"
            textDecorationThickness="1px"
            textUnderlineOffset="2px"
          >
            Push the frontier of carbon magic
          </Link>
        </ListItem>
        <ListItem display="flex" alignItems="center">
          <ListIcon as={GiStripedSun} boxSize={12} mr={4} />
          Send a luminous signal to the climate community
        </ListItem>
        <ListItem display="flex" alignItems="center">
          <ListIcon as={GiFireAce} boxSize={12} mr={4} />
          Acquire the ultimate, rock-solid comeback
        </ListItem>
      </List>

      <LidoVault inputToken={inputToken} outputToken={outputToken} />

      <HowItWorks inputToken={inputToken} outputToken={outputToken} />
    </VStack>
  )
}
