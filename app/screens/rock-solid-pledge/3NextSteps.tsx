import {
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import React from "react"

import { FacebookIcon, TwitterIcon } from "./components/SocialIcons"

export const SharePage: React.FC = () => {
  return (
    <Box as="section" py={{ base: "4", md: "8" }}>
      <Container maxW="3xl">
        <Box
          bg="bg-surface"
          boxShadow={useColorModeValue("sm", "sm-dark")}
          borderRadius="lg"
          p={{ base: "4", md: "6" }}
        >
          <Stack spacing="5">
            <Stack spacing="1">
              <Text fontSize="lg" fontWeight="medium">
                Share this with friends
              </Text>
              <Text fontSize="sm" color="muted">
                Email friends who have never tried Chakra UI
              </Text>
            </Stack>
            <Stack spacing="3" direction={{ base: "column", sm: "row" }}>
              <ButtonGroup variant="secondary">
                <Button leftIcon={<FacebookIcon boxSize={5} />}>Facebook</Button>
                <Button leftIcon={<TwitterIcon boxSize={5} />}>Twitter</Button>
              </ButtonGroup>
            </Stack>
            <Stack direction={{ base: "column", sm: "row" }} spacing="3">
              <FormControl id="email" width={{ sm: "auto" }}>
                <FormLabel>Send an invite</FormLabel>
                <Input type="email" placeholder="Your friends email" maxW={{ sm: "xs" }} />
              </FormControl>
              <Button variant="primary" alignSelf={{ sm: "flex-end" }}>
                Send
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
