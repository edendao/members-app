import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Link,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useMount } from "ahooks"
import * as pledge from "app/core/pledge"
import { Shimmer } from "ds/atoms/Shimmer"
import toast from "react-hot-toast"
import Typist from "react-typist"

interface EdenDaoProps extends StackProps {
  next: (data?: any) => void
}

export const EdenDao: React.FC<EdenDaoProps> = ({ next, ...stackProps }) => {
  useMount(() => {
    toast.success(
      <span>
        achievement unlocked!
        <br />
        <strong>carbon debtoooooooor</strong>
      </span>
    )
  })

  return (
    <Typist cursor={{ show: false }} avgTypingDelay={50} stdTypingDelay={25} key={Date.now()}>
      <VStack spacing={[6, 8]} {...stackProps}>
        <Shimmer size="md">welcome padawan to eden dao</Shimmer>
        <Typist.Delay ms={2000} />
        <Box animation="pulser-ccw 10s ease-in-out infinite alternate" textAlign="center" w="100%">
          <Shimmer size="md">
            bloom a regenerative renaissance
            <br />
            for the next millenium!
          </Shimmer>
        </Box>
        <Typist.Delay ms={2000} />
        <Text fontSize="lg" fontWeight="bold">
          CHAPTER ONE:{" "}
          <Shimmer as="span" size="sm">
            rock solid climate positive web3
          </Shimmer>
        </Text>
        <Typist.Delay ms={1000} />
        <VStack spacing={4}>
          <Alert status="warning" borderRadius="lg" color="orange.600" fontSize="lg">
            <AlertIcon />
            <AlertDescription>new mission:&nbsp;</AlertDescription>
            <AlertTitle>sign PLEDGE</AlertTitle>
          </Alert>
          <Typist.Delay ms={500} />
          <Button
            as={Link}
            isExternal
            target="_blank"
            variant="solid"
            colorScheme="purple"
            size="lg"
            _hover={{ textDecoration: "none" }}
            onClick={() => {
              pledge.open()
              next()
            }}
          >
            go to PLEDGE
          </Button>
        </VStack>
      </VStack>
    </Typist>
  )
}

export default EdenDao
