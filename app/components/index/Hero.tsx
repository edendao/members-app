import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Link,
  Stack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Estimate } from "app/core/networkEmissions"
import { numberToWords } from "app/core/numbers"
import { Image } from "blitz"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import EthereumCouncil from "public/ethereum-council.png"
import React from "react"
import { GiFootprint } from "react-icons/gi"
import { HiExternalLink } from "react-icons/hi"

interface HeroProps extends StackProps {
  emissions: [Estimate, Estimate]
}

export const Hero: React.FC<HeroProps> = ({ emissions, ...stackProps }) => {
  const [yesterday, total] = emissions.map((e) => numberToWords(e.best))

  return (
    <Stack
      id="hero"
      direction={["column-reverse", null, null, "row"]}
      pb={32}
      spacing={16}
      align="center"
      {...stackProps}
    >
      <VStack align="start" spacing={8} animation="pulser-ccw 15s ease-in-out infinite alternate">
        <Box>
          <Shimmer as="h1" size="xl" lineHeight={0.9}>
            ultra-sound money
          </Shimmer>
          <Heading as="h3" size="lg" lineHeight={1}>
            has left a carbon
          </Heading>
          <Shimmer as="h1" size="xl" lineHeight={0.9} mt={3}>
            footprint
          </Shimmer>
        </Box>
        <Text fontSize="lg">
          Yesterday, Ethereum{" "}
          <Link
            href="https://kylemcdonald.github.io/ethereum-emissions/"
            isExternal
            target="_blank"
            textDecoration="underline"
          >
            emitted ~{yesterday} tons of CO
          </Link>
          <sub>2</sub> into the atmosphere. Over its lifetime, that number is closer to{" "}
          <strong>{total}</strong> tCO2!
        </Text>
        <Text fontSize="2xl" fontWeight="medium">
          eden dao presents a tool to calculate your ethereum carbon footprint.
        </Text>
        <ButtonGroup size="lg">
          <Button
            as={Link}
            href="#widget"
            _hover={{ textDecoration: "none", color: "white", background: radiantBackground }}
            rightIcon={<GiFootprint />}
          >
            discover your footprint
          </Button>
          {/* <Button
            as={Link}
            href="#pledge"
            _hover={{ textDecoration: "none" }}
            color="white"
            fontWeight="bold"
            background={radiantBackground}
          >
            get climate positive money
          </Button> */}
        </ButtonGroup>
      </VStack>
      <VStack
        maxW={560}
        alignItems="center"
        animation="pulser-ccw 15s ease-in-out infinite alternate"
        transition="transform 500ms ease-in-out"
        _hover={{ transform: "scale(1.05)" }}
      >
        <Image src={EthereumCouncil} alt="Together we prosper." />
        <Link
          opacity={0.5}
          display="flex"
          flexDirection="row"
          alignItems="center"
          textStyle="label"
          fontSize="sm"
          fontStyle="italic"
          isExternal
          target="_blank"
          href="https://ethereum.org"
        >
          Ethereum&nbsp;
          <HiExternalLink />
        </Link>
      </VStack>
      {/* <VStack
        maxW={480}
        alignItems="center"
        animation="floater 5s ease-in-out infinite alternate"
        transition="transform 500ms ease-in-out"
        _hover={{ transform: "scale(1.05)" }}
      >

        <Image src={EthereumLegos} alt="Impact Money Legos" />
        <Link
          opacity={0.5}
          display="flex"
          flexDirection="row"
          alignItems="center"
          textStyle="label"
          fontSize="sm"
          fontStyle="italic"
          isExternal
          target="_blank"
          href="https://ethereum.org"
        >
          Ethereum&nbsp;
          <HiExternalLink />
        </Link>
      </VStack> */}
    </Stack>
  )
}
