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
            has left a footprint on
          </Heading>
          <Shimmer as="h1" size="xl" lineHeight={0.9} mt={3}>
            planet earth
          </Shimmer>
        </Box>
        <Text fontSize="lg">
          Over its lifetime, Ethereum has{" "}
          <Link
            href="https://kylemcdonald.github.io/ethereum-emissions/"
            isExternal
            target="_blank"
            textDecoration="underline"
          >
            emitted {total} tons of CO
          </Link>
          <sub>2</sub>, and {yesterday} tCO<sub>2</sub> yesterday! This carbon remains in the
          atmosphere for hundreds of years.
        </Text>
        <Text fontSize="2xl" fontWeight="medium">
          We built a tool to help you calculate the carbon impact from your Ethereum transactions.
        </Text>
        <ButtonGroup size="lg">
          <Button
            as={Link}
            href="#ethereum"
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
