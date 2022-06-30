import { Box, Heading, StackProps, VStack } from "@chakra-ui/react"
import { Shimmer } from "ds/atoms/Shimmer"

export const EdenDao: React.FC<StackProps> = (props) => {
  return (
    <VStack py={32} align="center" {...props}>
      <Box textAlign="center" animation="pulser-ccw 30s ease-in-out infinite alternate">
        <Shimmer size="2xl">eden dao</Shimmer>
        <Heading size="md" mb={3}>
          is the way towards
        </Heading>
        <Shimmer size="2xl" px={1}>
          planetary harmony
        </Shimmer>
      </Box>
    </VStack>
  )
}

export default EdenDao
