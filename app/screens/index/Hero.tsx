import { Button, ButtonGroup, Link, Stack, StackProps, Text, VStack } from "@chakra-ui/react"
import getNetworkEmissions from "app/ethereum/queries/getNetworkEmissions"
import { Image, useQuery } from "blitz"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import EthereumCouncil from "public/ethereum-council.png"
import EthereumLegos from "public/ethereum-legos.png"
import { HiExternalLink } from "react-icons/hi"

import { RadiantBackground } from "../../../ds/atoms/RadiantBackground"

const numberToWords = (n: number) =>
  n >= 1e9
    ? (n / 1e9).toFixed(2) + "B"
    : n >= 1e6
    ? (n / 1e6).toFixed(2) + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(2) + "K"
    : n.toFixed(2)

export const Hero: React.FC<StackProps> = (props) => {
  const [estimate] = useQuery(getNetworkEmissions, null, { suspense: false, retry: 2 })

  return (
    <>
      <Stack
        id="hero"
        py={16}
        direction={["column-reverse", null, null, "row"]}
        spacing={16}
        align="center"
        {...props}
      >
        <VStack align="start" spacing={8} animation="pulser-ccw 15s ease-in-out infinite alternate">
          <Shimmer as="h1" size="2xl" lineHeight={0.9} pt={5}>
            summon carbon rocks <wbr /> out of the ether
          </Shimmer>
          <Text as="h2" fontSize="2xl">
            Join the most ambitious, rock solid attempt yet to learn the carbon magic of locking it
            away permanently.
          </Text>
          <ButtonGroup size="lg">
            <Button
              as={Link}
              href="#ethereum"
              _hover={{ textDecoration: "none", color: "white", background: radiantBackground }}
            >
              learn more
            </Button>
            <Button
              as={Link}
              href="#pledge"
              _hover={{ textDecoration: "none" }}
              color="white"
              fontWeight="bold"
              background={radiantBackground}
            >
              become rock solid climate positive
            </Button>
          </ButtonGroup>
        </VStack>
        <VStack
          maxW={480}
          alignItems="center"
          animation="floater 5s ease-in-out infinite alternate"
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
        </VStack>
      </Stack>
      <Stack
        id="ethereum"
        py={32}
        direction={["column", null, null, null, "row"]}
        spacing={32}
        align="center"
        justify="space-between"
        {...props}
      >
        <VStack alignItems="center" animation="pulser-ccw 15s ease-in-out infinite alternate">
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
        <VStack
          align="start"
          justify="flex-start"
          minW={[320, null, 420, 540]}
          spacing={8}
          animation="pulser-ccw 15s ease-in-out infinite alternate"
        >
          <Shimmer px={1} lineHeight={1}>
            A climate positive Web3
          </Shimmer>
          <Text fontSize="lg">
            Ethereum&rsquo;s Proof of Work has{" "}
            <Link
              href="https://kylemcdonald.github.io/ethereum-emissions/"
              isExternal
              target="_blank"
              textDecoration="underline"
            >
              emitted {numberToWords(estimate?.best ?? 0)} tons of CO
            </Link>
            <sub>2</sub> that will remain in the atmosphere for hundreds of years. As Ethereum
            transitions to a Proof of Stake blockchain, let&rsquo;s work towards making the{" "}
            <strong>strongest, most rock solid case that Ethereum is climate positive.</strong>
          </Text>

          <Text fontSize="md">
            <strong>Let&rsquo;s take concrete steps to settle the score permanently</strong>, so
            that there is never any question that Ethereum is climate positive.
          </Text>
          <Button
            as={Link}
            _hover={{ textDecoration: "none" }}
            href="#frontier"
            size="lg"
            color="white"
            background={radiantBackground}
          >
            How do I take rock-solid steps towards climate positivity?
          </Button>
        </VStack>
      </Stack>
    </>
  )
}
