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
    <Flex
      id="frontier"
      py={32}
      direction={["column-reverse", null, null, "row"]}
      align="center"
      {...props}
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
            locking CO<sub>2</sub> permanently
          </Heading>
        </Box>
        <Text fontSize="lg">
          &ldquo;Permanent carbon removal&rdquo; is the <strong>Vegan Wagyu A5</strong> of carbon
          credits, and can permanently lock CO<sub>2</sub> into rocks (among other things) for
          10,000+ years. With them Web3 can make the rock-solid case that we&rsquo;re
          climate-positive.
        </Text>
        <Text fontSize="lg">
          We can get the best ones through Frontier Climate, which is the
          <em> world&rsquo;s best</em>, like, Proactive Public Goods DAO for sourcing and funding
          permanent carbon removal. They are the pioneer in upgrading humanity&rsquo;s
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
            discover frontier
          </Button>
          <Button
            colorScheme="purple"
            fontSize="xl"
            as={Link}
            href="#impact"
            _hover={{ textDecoration: "none" }}
          >
            rock the frontier
          </Button>
        </ButtonGroup>
      </VStack>
    </Flex>
  )
}

export default Frontier
