import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Stack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Transaction } from "@prisma/client"
import { Fraction, Token } from "@uniswap/sdk-core"
import { useERC20BalanceOf } from "app/core/hooks/web3/useERC20"
import { useSession } from "app/core/SessionManager"
import { toTokenAmount } from "app/core/tokens"
import getAllTransactions from "app/ethereum/queries/getAllTransactions"
import getEstimateForTransaction from "app/ethereum/queries/getEstimateForTransaction"
import { Image, invoke, useQuery } from "blitz"
import CostOfTCO2 from "public/carbonplan-cost-of-tCO2.png"
import React, { startTransition, useEffect, useState } from "react"
import { HiExternalLink } from "react-icons/hi"
import { useAccount, useBlockNumber } from "wagmi"

interface FootprintProps extends StackProps {
  inputToken: Token
  outputToken: Token
  next: () => void
}

export const Footprint: React.FC<FootprintProps> = ({
  inputToken,
  outputToken,
  next,
  ...props
}) => {
  const { data: account } = useAccount()
  const { data: balanceOf } = useERC20BalanceOf(outputToken.address, account?.address, {
    watch: false,
  })

  const vaultBalance = toTokenAmount(outputToken, balanceOf)
  const isAuthorized = vaultBalance?.greaterThan(new Fraction(1, 100))
  const txlimit =
    vaultBalance && isAuthorized
      ? Number(vaultBalance.asFraction.multiply(250).add(250).toFixed(0))
      : 50
  const { data: blocknumber } = useBlockNumber({ watch: false })
  const {
    estimationsCount = 0,
    tonYearsOfAtmosphericImpact = 0,
    txs = [],
  } = useEstimator(txlimit, blocknumber)
  const isCalculating = estimationsCount < txlimit
  const isLimited = txs.length > txlimit

  return (
    <VStack align="start" spacing={8} px={[0, 2, 4, 8]} {...props}>
      {txs.length !== 0 && isLimited && (
        <Alert status="warning" color="orange.500" borderRadius="lg">
          <AlertIcon />
          <AlertTitle>access limited</AlertTitle>
          <AlertDescription>go rock solid to estimate more transactions!</AlertDescription>
        </Alert>
      )}
      {txs.length === 0 ? (
        "No transactions found!"
      ) : (
        <Stack direction={["column", null, "row"]} spacing={4} justify="space-between" w="100%">
          <Box
            color="white"
            animation="pulser-ccw 10s ease-in-out infinite alternate"
            textAlign="center"
          >
            <Heading as="h4" size="xxs" mb={2}>
              from{" "}
              <strong>
                {estimationsCount}/{txs.length}
              </strong>{" "}
              transactions
            </Heading>
            <Heading
              fontFamily="cursive"
              fontWeight="normal"
              size="md"
              color="white"
              lineHeight={1}
            >
              your footprint is
            </Heading>
            <Heading as="h3" size="sm" fontWeight="normal" fontFamily="cursive">
              {tonYearsOfAtmosphericImpact.toFixed(2)} ton-years
            </Heading>
          </Box>

          <Button
            size="lg"
            onClick={next}
            animation="pulser-ccw 3s ease-in-out infinite alternate"
            color="white"
            colorScheme="orange"
            fontFamily="cursive"
            p={12}
            pb={10}
            fontSize="3xl"
            lineHeight={0.9}
            isLoading={isCalculating}
            disabled={isCalculating}
          >
            go rock solid
          </Button>
        </Stack>
      )}
      {/* <Text fontSize="lg" fontWeight="bold" px={8}>
        Eden Dao Carbon Proof of Impact tokens can be &ldquo;redeemed&rdquo; to go rock solid
        climate positive, as if they were a &ldquo;-1&rdquo; to get your account balance to zero
        (&ldquo;net-zero&rdquo;) or less than zero (&ldquo;carbon negative&rdquo;)
      </Text> */}
      <VStack align="start" spacing={2} fontSize="sm">
        <Heading size="xs">How does it work?</Heading>
        <OrderedList spacing={2} pl={5}>
          <ListItem>
            We measure the CO<sub>2</sub> emissions of the gas used in your transactions based on
            the entire Ethereum network&rsquo;s estimated emissions on that day.{" "}
            <Link
              fontSize="xs"
              display="inline-flex"
              color="gray.500"
              isExternal
              textDecoration="underline"
              target="_blank"
              href="https://patchtech.notion.site/Patch-Crypto-Carbon-Accounting-Methodology-f25e2a8dd34e4f55bbd92c9ee38516f9"
            >
              Patch
              <HiExternalLink />
            </Link>
          </ListItem>
          <ListItem>
            Then, we calculate your carbon footprint by considering that it takes over 310 years for
            1 ton of CO
            <sub>2</sub> emissions to naturally dissipate from the atmosphere&nbsp;
            <Link
              fontSize="xs"
              display="inline-flex"
              color="gray.500"
              href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
              target="_blank"
              isExternal
              textDecoration="underline"
            >
              (carbon)plan
              <HiExternalLink />
            </Link>
          </ListItem>
          <ListItem>
            This results in a footprint in ton&ndash;years, so you can think of 350 ton&ndash;years
            as 1 ton of locked carbon for 350 years, 350 tons locked for 1 year, or anything in
            between!
          </ListItem>
        </OrderedList>
      </VStack>
      <Link
        display="block"
        href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
        target="_blank"
        isExternal
        transition="transform 200ms ease-in-out infinite alternate"
        _hover={{ transform: "scale(1.05)" }}
      >
        <Image
          src={CostOfTCO2}
          alt="Research shows that 1 tCO2e has 310.16 ton•years of impact on the atmosphere"
        />
      </Link>
    </VStack>
  )
}

export default Footprint

const gCO2toTonYears = (gCO2: number) => (gCO2 * 310.16) / 1_000_000

const useEstimator = (
  txlimit: number,
  endblock: string | number | undefined,
  onComplete?: () => void
) => {
  const { address } = useSession()
  const [txs = [], txsQuery] = useQuery(getAllTransactions, `${endblock}`, {
    enabled: Boolean(address) && Boolean(endblock),
    retry: 2,
    suspense: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  const [gCO2forHash, setGCO2forHash] = useState<Record<string, number>>({})
  const [estimationsCount, setEstimationsCount] = useState<number>(0)

  const [tonYearsOfAtmosphericImpact, setImpact] = useState<number>(0)

  useEffect(() => {
    if (txlimit === 0 || !txs?.length) return

    let exit = false

    startTransition(() => {
      setEstimationsCount(0)
      setImpact(0)
    })
    ;(async () => {
      let i = 0
      for (const unknowntx of txs) {
        if (exit) return

        // Typescript is being quite... Typescript-y
        const tx = unknowntx as unknown as Transaction
        tx.gCO2 ??= await invoke(getEstimateForTransaction, tx.hash)

        startTransition(() => {
          setGCO2forHash((d) => ({ ...d, [tx.hash]: tx.gCO2! }))
          setImpact((i) => i + gCO2toTonYears(tx.gCO2!))
          setEstimationsCount((c) => c + 1)
        })

        if (++i == txlimit) break
      }
    })()

    return () => {
      exit = true
    }
  }, [txs, onComplete, txlimit])

  return { txs, txsQuery, gCO2forHash, tonYearsOfAtmosphericImpact, estimationsCount }
}
