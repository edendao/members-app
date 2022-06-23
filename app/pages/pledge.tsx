import { VStack } from "@chakra-ui/react"
import { RockSolidPledge } from "app/screens/rock-solid-pledge"

export default function PledgePage() {
  return (
    <VStack align="center" maxW={1440} mx="auto" spacing={0}>
      <RockSolidPledge />
    </VStack>
  )
}
