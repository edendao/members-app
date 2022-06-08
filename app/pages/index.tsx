import {
  Box,
  Button,
  Circle,
  HStack,
  Heading,
  Image,
  LightMode,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Layout from "app/core/layouts/Layout"
import { Session, getSession } from "blitz"
import { FaPlay } from "react-icons/fa"

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const privateData = await session.$getPrivateData()
  return {
    props: { session: privateData },
  }
}

interface HomeProps {
  session: Session
}

const Home: React.FC<HomeProps> = ({ session }) => {
  return (
    <Layout session={session}>
      <VStack spacing={32} align="center">
        <Box textAlign="center" id="hero">
          <Heading>join the most ambitious, rock solid attempt yet to</Heading>
          <Heading>level up our civilization&rsquo;s decarbonization skill tree</Heading>
          <Heading>
            as we learn how to wield the ether to summon carbon rocks out of thin air
          </Heading>
          <Button>How does it work?</Button>
          <Button>How do I play my part?</Button>
        </Box>
        <Box id="how-it-works">
          <Heading>How does it work?</Heading>
          <Text>
            Frontier Climate is like a Proactive Public Goods DAO with nearly $1B of capital staked,
            and founded by leaders from Stripe, Shopify, and Alphabet. They are the pioneer and
            rock-solid platinum standard for directly impacting our humanity&rsquo;s skill in freeze
            space-time CO<sub>2</sub> permanently into rocks.
          </Text>
          <Heading>The magic of making rocks</Heading>
          <Text>
            By default ETH is turned into stETH, and pledged towards Frontier Climate (as if it were
            a money lego). You should really check them out, their work is best in class.
          </Text>
          <Text>
            As Frontier Climate delivers these carbon assets we will tokenize them into Proof of
            Impact tokens based on the latest ton•year math (current thesis here) and airdrop them
            to EDEN holders.
          </Text>
        </Box>
        <Box id="you">
          <Heading>be proud of how we harmonize with our planet&rsquo;s ways.</Heading>
          <Heading>by permanently decarbonizing your Ethereum Proof of Work emissions.</Heading>
          <Text></Text>
          <ConnectButton />
        </Box>
      </VStack>
    </Layout>
  )
}

export default Home
