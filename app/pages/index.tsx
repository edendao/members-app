import { Box, Button, ButtonGroup, Heading, Stack, Text, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { MintEDENBox } from "app/ds/MintEDENBox"
import { Shimmer } from "app/ds/Shimmer"
import { Image, getSession } from "blitz"
import EthereumCouncil from "public/ethereum-council.png"
import EthereumLegos from "public/ethereum-legos.png"
import { PrivateSession } from "types"

interface IndexProps {
  session: PrivateSession
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const props: IndexProps = {
    session: (await session.$getPrivateData()) as PrivateSession,
  }
  return { props }
}

const Index: React.FC<IndexProps> = ({ session }) => {
  return (
    <Layout session={session}>
      <VStack spacing={32} my={32} align="center" maxW="6xl" mx="auto" px={16}>
        <Stack id="hero" direction={["column", null, "row"]} spacing={32} align="center">
          <VStack align="start" spacing={4}>
            <Shimmer as="h1" size="2xl">
              wield the ether to summon carbon
              <wbr /> out of thin air
            </Shimmer>
            <Text>
              Join the most ambitious, rock solid attempt yet to level up our civilization&rsquo;s
              decarbonization skill tree.
            </Text>
            <ButtonGroup size="lg">
              <Button color="gray.700" fontSize="md">
                Learn more
              </Button>
              <Button fontFamily="cursive" colorScheme="purple">
                Become rock-solid climate positive
              </Button>
            </ButtonGroup>
          </VStack>
          <Box>
            <Image src={EthereumLegos} alt="Impact Money Legos" />
          </Box>
        </Stack>

        <Stack direction={["column", null, "row"]} spacing={32} align="center">
          <Image src={EthereumCouncil} alt="Together we prosper." />
          <VStack align="start" justify="flex-start" minW={360}>
            <Shimmer>Why now?</Shimmer>
            <Text>
              As Ethereum transitions to a Proof of Stake blockchain, it&rsquo;s important to
              consider what it means to be truly <strong>carbon negative</strong>.
            </Text>
            <Text>
              We must think long-term. The best claim we can make of permanently undoing the effect
              of our emissions is by <em>permanently lock it away</em>.
            </Text>
            <Text>
              The industry knows them as permanent carbon removal, but we like to call them the{" "}
              <strong>Vegan Wagyu A5</strong> of carbon assets.
            </Text>
          </VStack>
        </Stack>

        <Stack direction={["column", null, null, "row"]} spacing={32} align="center">
          <VStack align="start" spacing={6}>
            <VStack align="start" spacing={3}>
              <Heading size="md" display="block" color="purple.600">
                Frontier Climate has entered the chat.
              </Heading>
              <Shimmer size="lg">Rock the world by locking carbon away permanently.</Shimmer>
              <Text size="xl">
                Frontier Climate is the <em>world&rsquo;s best</em>, like, Proactive Public Goods
                DAO for funding permanent carbon removal. They are the pioneer and rock-solid
                platinum standard in impacting humanity&rsquo;s skill in permanent carbon locking.
                It&rsquo;s founded by leaders hailing from Stripe, Shopify, and Alphabet, and has
                nearly US$1B staked.
              </Text>
            </VStack>
            <ButtonGroup size="lg">
              <Button
                as="a"
                href="https://frontierclimate.com/"
                target="_blank"
                color="gray.700"
                fontSize="md"
              >
                Discover Frontier Climate
              </Button>
              <Button fontFamily="cursive" colorScheme="purple">
                Lock it to rock it
              </Button>
            </ButtonGroup>
          </VStack>
          <VStack minW={420}>
            <Box>
              <iframe
                src="https://www.youtube.com/embed/z6sZaMBJ5ZM"
                title="Frontier Climate is quite literally pushing the frontier of what&rsquo;s possible."
                frameBorder="0"
                width="420"
                height="320"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </VStack>
        </Stack>

        <Stack direction="column" textAlign="center">
          <Heading>Will you play your part?</Heading>
          <Text fontStyle="italic">
            Now anyone with a wallet can make a rock-solid claim that they&rsquo;re climate
            positive.
          </Text>
        </Stack>

        <Box>
          <MintEDENBox session={session} />
        </Box>
        <Box pb={16}>Learn more about Eden Dao</Box>
      </VStack>
    </Layout>
  )
}

export default Index
