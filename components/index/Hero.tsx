import { Button, ButtonGroup, Link, Stack, StackProps, Text, VStack } from "@chakra-ui/react"
import { Image } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import EthereumLegos from "public/ethereum-legos.png"
import { HiExternalLink } from "react-icons/hi"

export const Hero: React.FC<StackProps> = (props) => {
  return (
    <Stack
      id="hero"
      py={16}
      direction={["column-reverse", null, null, "row"]}
      spacing={16}
      align="center"
      {...props}
    >
      <VStack align="start" spacing={8} animation="pulser 15s ease-in-out infinite alternate">
        <Shimmer as="h1" size="2xl" lineHeight={0.9} pt={5}>
          wield the ether to summon carbon
          <wbr /> out of thin air
        </Shimmer>
        <Text as="h2" fontSize="2xl">
          Join the most ambitious, rock solid attempt yet to learn the magic of bending carbon to
          lock it away permanently.
        </Text>
        <ButtonGroup size="lg">
          <Button
            as={Link}
            href="#ethereum"
            _hover={{ textDecoration: "none" }}
            variant="solid"
            colorScheme="purple"
          >
            learn more
          </Button>
          <Button
            as={Link}
            href="#impact"
            _hover={{ textDecoration: "none" }}
            color="white"
            fontWeight="bold"
            className="radiant-bg"
          >
            level up
          </Button>
        </ButtonGroup>
      </VStack>
      <VStack maxW={480} alignItems="center" animation="floater 5s ease-in-out infinite alternate">
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
  )
}
