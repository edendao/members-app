import {
  Box,
  Button,
  Heading,
  Input,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { PrivateSession } from "types"

export const MintEDENBox: React.FC<{ session: PrivateSession }> = ({ ...props }) => {
  return (
    <VStack id="take-action" spacing={8} {...props}>
      <Stack direction={["column", null, null, "row"]}>
        <VStack maxW="md" spacing={4} align="start">
          <Text>
            EDEN DAO&rsquo;s Frontier Vault is how Ethereum can pledge their capital towards
            Frontier Climate. This requires an 8-year, multi-million dollar commitment. And
            it&rsquo;s what we need to do to send <em>the strongest signal</em> to the world that
            Web3 cares.
          </Text>
          <Text>
            When we join Frontier Climate we will receive top shelf cosmic carbon assets. As they
            materialize, EDEN DAO will tokenize Proof of Impact tokens and airdrop them to token
            holders.
          </Text>
        </VStack>
      </Stack>
      <Box bg="gray.100">
        <Heading size="md">What do you owe future generations?</Heading>
        <Text>Estimate your wallet&rsquo;s Proof of Work carbon emissions.</Text>
        <ConnectButton label="Connect your wallet" />
      </Box>
      <Box bg="gray.100">
        <Heading>You have emitted X tons of CO2</Heading>
        <Text>We use the latest science to estimate emissions</Text>
        <Progress max={100} value={72} isAnimated hasStripe colorScheme="green" />
      </Box>
      <Box bg="gray.100">
        <Heading>Go climate positive</Heading>
        <Box p={4}>
          <Slider step={1} min={1} max={310}>
            <SliderMark value={1}>Offset for 1 year</SliderMark>
            <SliderMark value={310}>Permanently</SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Input placeholder="13020" />
        <Button colorScheme="green">Mint EDEN</Button>
        <Text>* details / disclaimer</Text>
      </Box>
      <Box bg="gray.100">
        <Heading>Signal your virtue</Heading>
        <Button colorScheme="twitter">TWEET IT</Button>
      </Box>
    </VStack>
  )
}
