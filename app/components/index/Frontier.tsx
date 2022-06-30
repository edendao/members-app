import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FlexProps,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Stack,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import { HiExternalLink } from "react-icons/hi"

export const Frontier: React.FC<FlexProps> = (props) => {
  const [videoWidth, videoHeight] = useBreakpointValue([
    [320, 320],
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
      <VStack align="start" spacing={6} maxW="100vw">
        <Shimmer
          size="md"
          lineHeight={1}
          as="h3"
          pt={2}
          pr={2}
          animation="pulser-cw 5s ease-in-out infinite alternate"
        >
          the gold standard of carbon impact
        </Shimmer>
        <Text fontSize="xl">
          To clean the mess in our atmosphere, we need to &ldquo;empty the tub&rdquo; of CO
          <sub>2</sub>. We can take rock-solid, generational steps by developing the magic of
          locking CO<sub>2</sub> permanently.
        </Text>
        <Text fontSize="lg">
          It would be great to stack on top of Frontier, like Impact DAOs. We&rsquo;re going to need
          a multi-million dollar commitment. Otherwise, we are well equipped to run a program
          ourselves.
        </Text>
        <OrderedList fontSize="lg" pl={6} spacing={2}>
          <ListItem>
            Frontier is the world&rsquo;s best, like, Proactive Public Goods DAO for this stuff!
          </ListItem>
          <ListItem>
            They have a legendary team of gigabrains from Alphabet, Stripe, Shopify, McKinsey, and
            dozens of PhDs!
          </ListItem>
          <ListItem>
            They are literally making history by stepping in where government is too slow!
          </ListItem>
        </OrderedList>
        <Stack
          fontSize="xl"
          animation="pulser-ccw 10s ease-in-out infinite alternate"
          spacing={4}
          direction={["column", null, "row"]}
        >
          <Button
            size="lg"
            as="a"
            href="https://frontierclimate.com/"
            target="_blank"
            rightIcon={<HiExternalLink />}
            _hover={{ color: "white", background: radiantBackground }}
          >
            read more about frontier
          </Button>
          <Button
            size="lg"
            as="a"
            href="#pledge"
            colorScheme="purple"
            _hover={{ textDecoration: "none", color: "white", background: radiantBackground }}
          >
            get rock-solid, ultra-sound money
          </Button>
        </Stack>
      </VStack>
    </Flex>
  )
}

export default Frontier
