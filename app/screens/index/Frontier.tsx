import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FlexProps,
  Heading,
  Link,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import { HiExternalLink } from "react-icons/hi"

export const Frontier: React.FC<FlexProps> = (props) => {
  const [videoWidth, videoHeight] = useBreakpointValue([
    [360, 360],
    [420, 420],
    [480, 480],
    [480, 480],
    [640, 640],
  ])!

  return (
    <Flex py={32} direction={["column-reverse", null, null, "row"]} align="center" {...props}>
      <Box
        minW={videoWidth}
        position="relative"
        left={[0, 0, -24]}
        mr={4}
        mt={[24, 0]}
        animation="pulser-ccw 30s ease-in-out infinite alternate"
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
          animation="pulser-cw 5s ease-in-out infinite alternate"
        >
          <Shimmer size="md" lineHeight={1} as="h3" pt={2} pr={2}>
            the rock solid gold standard of carbon assets
          </Shimmer>
          <Heading size="lg" lineHeight={1.2} as="h2" mt={0} mb={4} fontWeight="bold">
            permanent CO<sub>2</sub> removal
          </Heading>
        </Box>
        <Text fontSize="xl">
          Humanity is rapidly developing the magic of summoning rocks out of thin air. To clean up
          the mess in our atmosphere, they&rsquo;re turning CO<sub>2</sub> into rocks so it can
          never go back up there again. Of course, this isn&rsquo;t the only way to lock carbon away
          permanently, so if you want to learn more, watch the video.
        </Text>
        <Text fontSize="lg">
          Frontier Climate is the world&rsquo;s best, like, Proactive Public Goods DAO for this
          stuff. They are the pioneering this with a legendary team of gigabrains from Alphabet,
          Stripe, Shopify, McKinsey, and almost 30 PhDs! They are literally making history by
          stepping in where government is too slow.
        </Text>
        <Text fontSize="lg">
          <strong>
            Frontier is the rock solid gold standard of carbon impact.{" "}
            <Link isExternal href="https://frontierclimate.com/" textDecoration="underline">
              Read more about them, their theory of impact, their methodology, and their team
            </Link>
          </strong>
          .
        </Text>
        <Text fontSize="lg">
          Our mandate for carbon assets will be just like Frontier&rsquo;s. We can run a program
          ourselves, but ideally, we stack on top of Frontier&rsquo;s program as if they were an
          Impact DAO. The only way we can join Frontier is if we create a movement, because we need
          a multi-million dollar commitment.
        </Text>
        <ButtonGroup
          size="lg"
          fontSize="xl"
          animation="pulser-ccw 10s ease-in-out infinite alternate"
        >
          <Button
            as="a"
            href="https://frontierclimate.com/"
            target="_blank"
            rightIcon={<HiExternalLink />}
            _hover={{ color: "white", background: radiantBackground }}
          >
            Read more about Frontier Climate
          </Button>
          <Button
            as="a"
            href="#pledge"
            colorScheme="purple"
            _hover={{ textDecoration: "none", color: "white", background: radiantBackground }}
          >
            get rock-solid, ultra-sound money
          </Button>
        </ButtonGroup>
      </VStack>
    </Flex>
  )
}
