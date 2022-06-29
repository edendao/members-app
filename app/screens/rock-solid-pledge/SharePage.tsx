import { Button, ButtonGroup, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { HiClipboardCopy, HiMailOpen } from "react-icons/hi"

import { FacebookIcon, TwitterIcon } from "./components/SocialIcons"

export const SharePage: React.FC = () => {
  return (
    <Stack spacing={4} as="section">
      <Stack spacing="1">
        <Text fontSize="lg" fontWeight="medium">
          Share this with friends
        </Text>
        <Text fontSize="sm" color="muted">
          Share the rock solid impact pledge
        </Text>
      </Stack>
      <ButtonGroup variant="secondary">
        <Button colorScheme="orange" leftIcon={<HiClipboardCopy />}>
          Copy Link
        </Button>
        <Button colorScheme="blue" leftIcon={<HiMailOpen />}>
          Email
        </Button>
        <Button leftIcon={<FacebookIcon boxSize={5} />}>Facebook</Button>
        <Button leftIcon={<TwitterIcon boxSize={5} />}>Twitter</Button>
      </ButtonGroup>
    </Stack>
  )
}

export default SharePage
