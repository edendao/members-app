import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Token } from "@uniswap/sdk-core"
import { Shimmer } from "ds/atoms/Shimmer"
import { GiFootprint } from "react-icons/gi"
import { HiArrowLeft, HiExternalLink } from "react-icons/hi"

import { LidoVault } from "./components/LidoVault"

interface PledgerProps {
  back: () => void
  inputToken: Token
  outputToken: Token
}

export const Pledger: React.FC<PledgerProps> = ({ inputToken, outputToken, back }) => {
  return (
    <VStack spacing={6} p={[4, null, 8]} align="start">
      <Button mb={4} onClick={back} leftIcon={<HiArrowLeft />} rightIcon={<GiFootprint />}>
        Footprint Calculator
      </Button>
      {/* <List fontSize="xl" display="flex" flexDirection="column" alignItems="start" spacing={4}>
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
      </List> */}

      <Box>
        <Shimmer as="h1" size="lg" lineHeight={0.9} pt={4}>
          your ultra-sound money
        </Shimmer>
        <Heading as="h3" size="md" lineHeight={1}>
          can summon carbon rocks
        </Heading>
        <Shimmer as="h1" size="xl" lineHeight={0.9} pt={2} mt={1}>
          from the ether
        </Shimmer>
      </Box>

      <VStack align="start">
        <Heading as="h3" size="xs">
          How does it work?
        </Heading>
        <OrderedList fontSize="lg" spacing={2} pl={7}>
          <ListItem>
            Wrap 1 stETH for 1 {outputToken.symbol}
            <Text fontSize="md" color="purple.400" fontFamily="cursive">
              While in the vault, your stETH yield is pledged to our mission!
            </Text>
          </ListItem>
          <ListItem>
            Together we support permanent carbon locking magic
            <Text fontSize="md" color="purple.400" fontFamily="cursive">
              Get ednEARTH carbon impact certificates to go climate positive!
            </Text>
          </ListItem>
          <ListItem>
            Your ultra-sound money makes rock-solid climate impact
            <Text fontSize="md" color="purple.400" fontFamily="cursive">
              At anytime, unwrap your stETH and get back exactly what you put in!
            </Text>
          </ListItem>
        </OrderedList>
      </VStack>

      <Alert
        status="warning"
        color="orange.600"
        borderRadius="lg"
        animation="pulser-cw 10s ease-in-out infinite alternate"
      >
        <AlertIcon />
        <AlertTitle>You need ≥0.01 {inputToken.symbol}</AlertTitle>
        <Button
          ml="auto"
          size="sm"
          as={Link}
          isExternal
          variant="solid"
          colorScheme="orange"
          href={`https://app.uniswap.org/#/swap?outputCurrency=${inputToken.address}`}
          _hover={{ textDecoration: "none" }}
          rightIcon={<HiExternalLink />}
        >
          Lucky ~4% discount on Uniswap!
        </Button>
      </Alert>

      <LidoVault inputToken={inputToken} outputToken={outputToken} />

      <Text fontSize="sm" color="purple.400">
        By depositing into Eden Dao&rsquo;s Vault contract at Ethereum address (
        {outputToken.address}) you, the Contributor, donate the yield on your {inputToken.name} (
        {inputToken.symbol}) in order to receive {outputToken.symbol} tokens solely for the
        Contributor’s own benefit and account, for the purposes of personal consumption and
        utilization of {outputToken.symbol} tokens on Ethereum and not for any speculative purpose
        or with an expectation of profit, and not with a view to, or for resale in connection with,
        a public offering or other distribution of {outputToken.symbol} tokens, whether in exchange
        for other any other digital asset, any currency, any security or otherwise, and all of the
        foregoing remains true, accurate and complete on and as of the date of the contribution.
      </Text>
    </VStack>
  )
}

export default Pledger
