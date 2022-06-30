import { Box, Button, Heading, Link, Stack, StackProps, Text, VStack } from "@chakra-ui/react"
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
        <Shimmer as="h1" size={["md", "lg"]} lineHeight={0.9}>
          your ultra-sound money has a carbon footprint!
        </Shimmer>
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
          <sub>2</sub> into <strong>our</strong> atmosphere. Over its lifetime, that number is
          closer to {total} tons!
        </Text>
        <Box animation="pulser-ccw 15s ease-in-out infinite alternate">
          <Button
            as={Link}
            size="lg"
            href="#widget"
            bg={radiantBackground}
            color="white"
            _hover={{ color: "white", textDecoration: "none" }}
          >
            discover your ethereum carbon footprint!
          </Button>
        </Box>
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
