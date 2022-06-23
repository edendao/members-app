import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Progress,
  Stack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Token } from "@uniswap/sdk-core"
import getAllTransactions from "app/ethereum/queries/getAllTransactions"
import getEstimateForTransaction from "app/ethereum/queries/getEstimateForTransaction"
import getSession from "app/users/queries/getSession"
import { Image, invoke, useQuery } from "blitz"
import CostOfTCO2 from "public/carbonplan-cost-of-tCO2.png"
import React, { useEffect, useState, useTransition } from "react"
import { useBlockNumber } from "wagmi"

interface EstimatorProps extends StackProps {
  inputToken: Token
  outputToken: Token
  next: () => void
}

export const Estimator: React.FC<EstimatorProps> = ({
  inputToken,
  outputToken,
  next,
  ...props
}) => {
  const { data: blocknumber } = useBlockNumber()
  const {
    estimationsCount = 0,
    tonYearsOfAtmosphericImpact = 0,
    txs = [],
  } = useTransactionsLoader(blocknumber)

  const isCalculating = estimationsCount < txs.length

  return (
    <VStack spacing={8} p={[4, null, 8]} bg="#1d1e24" borderRadius="xl" {...props}>
      <Flex direction={["column", null, null, "row"]} align="center" w="100%" justify="center">
        <Text as="span" fontSize={16} fontWeight="bold" color="yellow.400">
          Atmospheric impact of
        </Text>
        <Box mt="-1px">
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
        </Box>
      </Flex>
      {txs.length !== 0 && (
        <Stack direction={["column", null, "row"]} align="center" justify="space-evenly" w="100%">
          <Box
            color="white"
            animation="pulser-ccw 10s ease-in-out infinite alternate"
            textAlign="center"
          >
            <Heading as="h3" size="sm" fontWeight="normal" fontFamily="cursive">
              {tonYearsOfAtmosphericImpact.toFixed(2)} ton-years
            </Heading>

            <Text as="h4" fontSize="lg">
              from {estimationsCount}/{txs.length} transactions
            </Text>
          </Box>

          <Button
            size="lg"
            onClick={next}
            animation="pulser-ccw 3s ease-in-out infinite alternate"
            colorScheme="purple"
            fontFamily="cursive"
            p={8}
            pb={7}
            fontSize="3xl"
            lineHeight={0.9}
            isLoading={isCalculating}
            disabled={isCalculating}
          >
            go climate positive
          </Button>
        </Stack>
      )}
      {isCalculating && (
        <Box
          transition="transform 200ms ease-in-out infinite alternate"
          w="100%"
          px={16}
          _hover={{ transform: "scale(1.025) rotate(1deg)" }}
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
          transition="transform 200ms ease-in-out infinite alternate"
          _hover={{ transform: "scale(1.05)" }}
        >
          <Image
            src={CostOfTCO2}
            alt="Research shows that 1 tCO2e has 310.16 ton•years of impact on the atmosphere"
          />
        </Link>
        <Text color="gray.400" mt={4} fontSize="lg">
          To undo the impact of 1 ton of CO<sub>2</sub> emissions, 1 ton of carbon must be
          <strong> locked</strong> for 310.16 years.{" "}
          <Link
            href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
            target="_blank"
            isExternal
            textDecoration="underline"
          >
            Learn more from (carbon)plan
          </Link>
          .
        </Text>
      </Box>
    </VStack>
  )
}

const gCO2toTonYears = (gCO2: number) => (gCO2 * 310.16) / 1_000_000

const useTransactionsLoader = (endblock: string | number | undefined, onComplete?: () => void) => {
  const [session] = useQuery(getSession, null, { suspense: false })
  const [txs = [], txsQuery] = useQuery(getAllTransactions, `${endblock}`, {
    enabled: Boolean(session?.address) && Boolean(endblock),
    retry: 2,
    suspense: false,
  })
  const [gCO2forHash, setGCO2forHash] = useState<Record<string, number>>({})
  const [estimationsCount, setEstimationsCount] = useState<number>(0)

  const [tonYearsOfAtmosphericImpact, setImpact] = useState<number>(0)
  const [, startTransition] = useTransition()

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

          startTransition(() => {
            setGCO2forHash((d) => ({ ...d, [tx.hash]: gCO2 }))
            setImpact((i) => i + gCO2toTonYears(gCO2))
            setEstimationsCount((c) => c + 1)
          })
        }
      })()

      return () => {
        setEstimationsCount(0)
        setImpact(0)
        exit = true
      }
    }
  }, [txs, onComplete, startTransition])

  return { txs, txsQuery, gCO2forHash, tonYearsOfAtmosphericImpact, estimationsCount }
}
