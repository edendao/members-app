import {
  Box,
  BoxProps,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  Progress,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import getAllTransactions from "app/ethereum/queries/getAllTransactions"
import getEstimateForTransaction from "app/ethereum/queries/getEstimateForTransaction"
import getSession from "app/users/queries/getSession"
import { Image, invoke, useQuery } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import CostOfTCO2 from "public/carbonplan-cost-of-tCO2.png"
import React, { useEffect, useState } from "react"
import {
  GiCoolSpices,
  GiFireAce,
  GiHeartWings,
  GiMagicGate,
  GiMagicPortal,
  GiMagicSwirl,
  GiMountaintop,
  GiSkills,
  GiSpiralBottle,
  GiStripedSun,
} from "react-icons/gi"
import { useAccount, useBlockNumber } from "wagmi"

type State = "0ready" | "1estimating" | "2signpost" | "3deposit" | "9complete"

export const ImpactEstimator: React.FC<BoxProps> = (props) => {
  const { data: account } = useAccount()
  const { data: blocknumber } = useBlockNumber()

  const [state, setState] = useState<State>(account?.address ? "1estimating" : "0ready")

  useEffect(() => {
    if (!account?.address) {
      setState("0ready")
    } else if (account?.address && state === "0ready") {
      setState("1estimating")
    }
  }, [account?.address, state])

  const {
    estimationsCount = 0,
    tonYearsOfAtmosphericImpact = 0,
    txs = [],
  } = useTransactionsLoader(blocknumber)

  const isCalculating = estimationsCount < txs.length

  return (
    <Box
      {...props}
      p={[8, null, null, 12]}
      borderRadius="lg"
      color={state === "3deposit" ? "purple.700" : "gray.100"}
      bg={state === "3deposit" ? "white" : "#1d1e23"}
      boxShadow="xl"
      transition="box-shadow 1s ease-in-out"
      _hover={{ boxShadow: "2xl" }}
      w="100%"
      minW={360}
      maxW="3xl"
    >
      {state === "0ready" ? (
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading fontWeight="normal" fontFamily="cursive" as="h3" size="lg">
              what&rsquo;s your mark on the world?
            </Heading>
            <Text fontSize="lg">
              Estimate your atmospheric carbon impact from Ethereum&rsquo;s Proof of Work.
            </Text>
            <Text fontSize="sm" color="gray.500">
              We use{" "}
              <Link isExternal textDecoration="underline">
                Etherscan to list transactions
              </Link>{" "}
              and{" "}
              <Link isExternal textDecoration="underline">
                Patch to estimate emissions
              </Link>
              .
            </Text>
          </Box>
          <Box transform="scale(1.1)">
            <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
          </Box>
        </VStack>
      ) : state === "1estimating" ? (
        <VStack spacing={8}>
          <Flex direction={["column", null, null, "row"]} align="center" w="100%" justify="center">
            <Text as="span" fontSize={16} fontWeight="bold" color="yellow.400">
              Atmospheric impact of
            </Text>
            <Box mt="-1px">
              <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
            </Box>
          </Flex>
          {txs.length !== 0 && (
            <Stack
              direction={["column", null, "row"]}
              align="center"
              justify="space-evenly"
              w="100%"
            >
              <Box color="white">
                <Heading as="h3" size={["sm", null, "md"]} fontWeight="normal" fontFamily="cursive">
                  {tonYearsOfAtmosphericImpact.toFixed(2)} ton-years
                </Heading>

                <Text as="h4" fontSize="lg">
                  from {estimationsCount}/{txs.length} transactions
                </Text>
              </Box>

              <Button
                size="lg"
                onClick={() => setState("2signpost")}
                id="#impact"
                animation="pulser 3s ease-in-out infinite alternate"
                colorScheme="purple"
                fontFamily="cursive"
                p={8}
                pb={7}
                fontSize="3xl"
                lineHeight={0.9}
                isLoading={isCalculating}
                disabled={isCalculating}
                backgroundSize="200%"
              >
                Go climate positive
              </Button>
            </Stack>
          )}
          {isCalculating && (
            <Box
              transition="transform 200ms ease-in-out"
              w="100%"
              px={16}
              _hover={{ transform: "scale(1.1) rotate(2deg)" }}
            >
              <Progress
                alignSelf="start"
                size="lg"
                colorScheme="yellow"
                hasStripe
                isAnimated
                isIndeterminate={estimationsCount === 0}
                value={estimationsCount}
                max={txs.length}
              />
            </Box>
          )}
          <Box>
            <Link
              display="block"
              href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
              target="_blank"
              isExternal
              transition="transform 200ms ease-in-out"
              _hover={{ transform: "scale(1.02) rotate(-1deg)" }}
            >
              <Image
                src={CostOfTCO2}
                alt="Research shows that 1 tCO2e has 310.16 ton•years of impact on the atmosphere"
              />
            </Link>
            <Text color="gray.400" mt={4} fontSize="lg">
              To undo the impact of 1 ton of CO<sub>2</sub> emissions, 1 ton of carbon must be
              <strong> locked</strong> for 310.16 years. Learn more with the{" "}
              <Link
                href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
                target="_blank"
                isExternal
                textDecoration="underline"
              >
                (carbon)plan ton-year explainer
              </Link>
              .
            </Text>
          </Box>
        </VStack>
      ) : state === "2signpost" ? (
        <VStack spacing={10} p={8} align="start">
          <Heading fontFamily="cursive" fontWeight="normal" as="h2" size="lg" lineHeight={1} my={0}>
            rock solid impact pledge
          </Heading>
          <List fontSize="xl" alignItems="start" spacing={2}>
            <ListItem>
              <ListIcon as={GiHeartWings} boxSize={6} mr={3} />
              For the Public Good
            </ListItem>
            <ListItem>
              <ListIcon as={GiSkills} boxSize={6} mr={3} />
              Levels up humanity
            </ListItem>
            <ListItem>
              <ListIcon as={GiSpiralBottle} boxSize={6} mr={3} />
              Push the{" "}
              <Link
                href="#frontier"
                textDecoration="underline"
                textDecorationThickness="1px"
                textUnderlineOffset="2px"
              >
                frontier of carbon magic
              </Link>
            </ListItem>
            <ListItem>
              <ListIcon as={GiStripedSun} boxSize={6} mr={3} />
              Send a luminous signal to the climate community
            </ListItem>
            <ListItem>
              <ListIcon as={GiMountaintop} boxSize={6} mr={3} />
              Get Vegan Wagyu A5 Proof of Carbon Impact Tokens
            </ListItem>
            <ListItem>
              <ListIcon as={GiFireAce} boxSize={6} mr={3} />
              Acquire the ultimate comeback
            </ListItem>
          </List>
          <Box>
            <Button
              size="lg"
              fontSize="xl"
              p={6}
              colorScheme="yellow"
              onClick={() => setState("3deposit")}
              leftIcon={<GiMagicPortal />}
              rightIcon={<GiMagicSwirl />}
            >
              take the pledge
            </Button>
          </Box>
        </VStack>
      ) : state === "3deposit" ? (
        <Stack spacing={8} align="center" direction="column">
          <VStack
            w="100%"
            p={8}
            minHeight={200}
            align="center"
            justify="center"
            textAlign="center"
            opacity={0.4}
            transition="all 0.5s ease-in-out"
            _hover={{ boxShadow: "inner", opacity: 1 }}
          >
            <Shimmer as="h2" size="lg" my={0}>
              FRONTIER PLEDGE
            </Shimmer>
            <Text fontSize="2xl">
              Redirect <strong>ETH staking yield</strong> towards Frontier Climate.
            </Text>
            <Text>In 2030, withdraw the exact amount of ETH you put in.</Text>
          </VStack>
          <Divider mx={64} />
          <VStack
            w="100%"
            p={8}
            minHeight={200}
            align="center"
            justify="center"
            textAlign="center"
            opacity={0.4}
            transition="all 0.5s ease-in-out"
            _hover={{ boxShadow: "inner", opacity: 1 }}
          >
            <Shimmer as="h2" size="lg" my={0}>
              2023 PLEDGE
            </Shimmer>
            <Text fontSize="2xl">
              Send <strong>ETH</strong> for a 2023 Frontier Climate commitment.
            </Text>
            <Text>Closing March 20, 2023, 2:24pm GMT</Text>
          </VStack>
        </Stack>
      ) : null}
    </Box>
  )
}

export default ImpactEstimator

const gCO2toTonYears = (gCO2: number) => (gCO2 * 310.16) / 1_000_000

const useTransactionsLoader = (endblock: string | number | undefined, onComplete?: () => void) => {
  const [session] = useQuery(getSession, null, { suspense: false })
  const [txs, txsQuery] = useQuery(getAllTransactions, `${endblock}`, {
    enabled: Boolean(session?.address) && Boolean(endblock),
    retry: 2,
    suspense: false,
  })
  const [gCO2forHash, setGCO2forHash] = useState<Record<string, number>>({})
  const [estimationsCount, setEstimationsCount] = useState<number>(0)

  const [tonYearsOfAtmosphericImpact, setImpact] = useState<number>(0)

  useEffect(() => {
    if (txs?.length) {
      let exit = false

      setEstimationsCount(0)
      setImpact(0)
      ;(async () => {
        for (let i = 0; i < txs.length; ++i) {
          if (exit) return
          const tx = txs[i]
          if (!tx) continue

          const gCO2 = (tx.gCO2 ||= await invoke(getEstimateForTransaction, tx.hash))

          setGCO2forHash((d) => ({ ...d, [tx.hash]: gCO2 }))
          setImpact((i) => i + gCO2toTonYears(gCO2))
          setEstimationsCount((c) => c + 1)
        }
      })()

      return () => {
        setEstimationsCount(0)
        setImpact(0)
        exit = true
      }
    }
  }, [txs, onComplete])

  return { txs, txsQuery, gCO2forHash, tonYearsOfAtmosphericImpact, estimationsCount }
}
