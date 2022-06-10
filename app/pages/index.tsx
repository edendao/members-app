import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Link,
  SlideFade,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Image, dynamic, getSession } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import Layout from "ds/Layout"
import EthereumCouncil from "public/ethereum-council.png"
import EthereumLegos from "public/ethereum-legos.png"
import RasterBee from "public/raster-bee.png"
import { useInView } from "react-hook-inview"
import { GiCoolSpices, GiPlanetConquest, GiSkills } from "react-icons/gi"
import { HiExternalLink } from "react-icons/hi"
import { PrivateSession } from "types"

const ImpactEstimator = dynamic(() => import("ds/molecules/ImpactEstimator"))

interface IndexProps {
  session: PrivateSession
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const props: IndexProps = {
    session: (await session.$getPrivateData()) as PrivateSession,
  }
  return {
    props,
  }
}

const LandingPage: React.FC<IndexProps> = ({ session }) => {
  const [videoWidth, videoHeight] = useBreakpointValue([
    [360, 360],
    [420, 420],
    [480, 480],
    [480, 480],
    [640, 640],
  ])!

  const [estimatorRef, isEstimatorVisible] = useInView({ unobserveOnEnter: true })

  return (
    <Layout session={session}>
      <VStack my={32} mx="auto" px={16} align="center" maxW={1440} spacing={0}>
        <Stack
          id="hero"
          py={16}
          direction={["column-reverse", null, null, "row"]}
          spacing={16}
          align="center"
        >
          <VStack align="start" spacing={8} animation="pulser 15s ease-in-out infinite alternate">
            <Shimmer as="h1" size="2xl" lineHeight={0.9} pt={5}>
              wield the ether to summon carbon
              <wbr /> out of thin air
            </Shimmer>
            <Text as="h2" fontSize="2xl">
              Join the most ambitious, rock solid attempt yet to learn the magic of bending carbon
              to lock it away permanently.
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
                rightIcon={<GiSkills />}
              >
                level humanity up
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
        >
          <VStack alignItems="center" animation="pulser 15s ease-in-out infinite alternate">
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
            animation="pulser 15s ease-in-out infinite alternate"
          >
            <Shimmer px={1} lineHeight={1}>
              A climate positive Web3
            </Shimmer>
            <Text fontSize="lg">
              Ethereum&rsquo;s Proof of Work CO<sub>2</sub> emissions will remain in the atmosphere
              for hundreds of years. As Ethereum transitions to a Proof of Stake blockchain,
              it&rsquo;s important to consider what it means to be{" "}
              <strong>truly climate positive</strong>.
            </Text>
            <Text fontSize="lg">
              Let&rsquo;s settle our carbon impact permanently, so that there is no question today
              nor in 1,000 years that Ethereum is climate positive.
            </Text>
            <Button as={Link} _hover={{ textDecoration: "none" }} href="#impact" size="lg">
              Let&rsquo;s fucking go climate positive
            </Button>
          </VStack>
        </Stack>

        <Box
          id="bee"
          position="relative"
          w="100vw"
          minH={["20vh", null, null, "50vh", "70vh", "100vh"]}
          color="white"
          p={0}
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
            zIndex="-1"
            className="radiant-bg"
          />
          <Box position="absolute" top="0" right="0" height="100%">
            <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
          </Box>
        </Box>

        <Flex
          id="impact"
          position="relative"
          overflow="hidden"
          direction="column"
          align="center"
          justify="center"
          w="100vw"
          minH="100vh"
          p={32}
          color="white"
        >
          <Box
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
            zIndex="-1"
            className="radiant-bg"
          />

          <SlideFade offsetY={20} in={isEstimatorVisible}>
            <ImpactEstimator mt={6} />
          </SlideFade>

          <Box position="absolute" bottom="25vh" w="1" h="1" right="0" ref={estimatorRef} />
        </Flex>

        <Flex
          id="frontier"
          py={32}
          direction={["column-reverse", null, null, "row"]}
          align="center"
        >
          <Box
            minW={videoWidth}
            position="relative"
            left={[0, 0, -24]}
            mr={4}
            mt={[24, 0]}
            animation="pulser 30s ease-in-out infinite alternate"
            borderRadius="large"
          >
            <iframe
              src="https://www.youtube.com/embed/z6sZaMBJ5ZM"
              title="Frontier Climate is quite literally pushing the frontier of what&rsquo;s possible."
              frameBorder="0"
              width={videoWidth}
              height={videoHeight}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
          <VStack align="start" spacing={6}>
            <Box
              textAlign={["center", null, null, "left"]}
              animation="pulser 5s ease-in-out infinite alternate"
            >
              <Shimmer size="md" lineHeight={1} as="h3" pt={2} pr={2}>
                rock the world with rock-solid impact by
              </Shimmer>
              <Heading size="lg" lineHeight={1.2} as="h2" mt={0} mb={4} fontWeight="bold">
                Locking CO<sub>2</sub> permanently
              </Heading>
            </Box>
            <Text fontSize="lg">
              &ldquo;Permanent carbon removal&rdquo; is the <strong>Vegan Wagyu A5</strong> of
              carbon credits, and can permanently lock CO<sub>2</sub> into rocks (among other
              things) for 10,000+ years. With them Web3 can make the rock-solid case that
              we&rsquo;re climate-positive.
            </Text>
            <Text fontSize="lg">
              We can get the best ones through Frontier Climate, which is the
              <em> world&rsquo;s best</em>, like, Proactive Public Goods DAO for sourcing and
              funding permanent carbon removal. They are the pioneer in upgrading humanity&rsquo;s
              carbon-bending skillset. Oh, and they have almost US$1B in funds staked from Alphabet,
              Stripe, Shopify, and McKinsey.
            </Text>
            <ButtonGroup size="lg" animation="pulser 10s ease-in-out infinite alternate">
              <Button
                as="a"
                href="https://frontierclimate.com/"
                target="_blank"
                fontSize="xl"
                rightIcon={<HiExternalLink />}
              >
                Discover Frontier
              </Button>
              <Button
                colorScheme="purple"
                fontSize="xl"
                as={Link}
                href="#impact"
                _hover={{ textDecoration: "none" }}
              >
                Rock the Frontier
              </Button>
            </ButtonGroup>
          </VStack>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default LandingPage
