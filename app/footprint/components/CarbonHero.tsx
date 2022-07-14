import { Box, Button, Link, Stack, StackProps, Text, VStack } from "@chakra-ui/react"
import { numberToWords } from "app/core/numbers"
import { Estimate } from "app/footprint/services/ethereumEmissions"
import { Image } from "blitz"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import EthereumCouncil from "public/ethereum-council.png"
import React from "react"
import { HiExternalLink } from "react-icons/hi"
import Typist from "react-typist"

interface CarbonHeroProps extends StackProps {
  cta: string
  estimates: [Estimate, Estimate]
}

export const CarbonHero: React.FC<CarbonHeroProps> = ({ estimates, cta, ...stackProps }) => {
  const [yesterday, total] = estimates.map((e) => numberToWords(e.best))

  return (
    <Stack
      id="hero"
      direction={["column-reverse", null, null, "row"]}
      pb={32}
      spacing={16}
      align="center"
      {...stackProps}
    >
      <VStack align="start" spacing={8} animation="pulser-ccw 5s ease-in-out infinite alternate">
        <Shimmer as="h1" size={["md", "lg"]} lineHeight={0.9}>
          your ultra-sound money has a carbon footprint!
        </Shimmer>
        <Text fontSize="lg">
          <Typist cursor={{ show: false }} avgTypingDelay={50}>
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
          </Typist>
        </Text>
        <Box animation="pulser-ccw 5s ease-in-out infinite alternate">
          <Button
            as={Link}
            size="lg"
            href="#widget"
            colorScheme="yellow"
            color="white"
            _hover={{ color: "white", textDecoration: "none" }}
            _active={{ background: radiantBackground }}
          >
            {cta}
          </Button>
        </Box>
      </VStack>
      <VStack
        maxW={560}
        alignItems="center"
        animation="pulser-ccw 5s ease-in-out infinite alternate"
        transition="transform 500ms ease-in-out"
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
    </Stack>
  )
}
