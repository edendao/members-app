import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  Link,
  ListItem,
  NumberInput,
  NumberInputField,
  OrderedList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CurrencyAmount, Fraction, Token } from "@uniswap/sdk-core"
import { toTokenAmount } from "app/core/tokens"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import {
  useERC20Allowance,
  useERC20ApproveCallback,
  useERC20BalanceOf,
} from "ds/hooks/web3/useERC20"
import { useVaultDeposit } from "ds/hooks/web3/useVault"
import { useSession } from "ds/molecules/SessionManager"
import { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { GiAllSeeingEye, GiMagicGate } from "react-icons/gi"
import { HiExternalLink } from "react-icons/hi"
import { useWaitForTransaction } from "wagmi"

interface CardProps {
  inputToken: Token
  outputToken: Token
}

export const Card: React.FC<CardProps> = ({ inputToken, outputToken }) => {
  const [formattedAmount, setFormattedAmount] = useState<string>("0.01")
  const inputAmount = useMemo(
    () => toTokenAmount(inputToken, Number(formattedAmount) * 1e18),
    [inputToken, formattedAmount]
  )

  const { address } = useSession()
  const { data: balanceOf } = useERC20BalanceOf(inputToken.address, address)
  const maxCommit = useMemo(() => toTokenAmount(inputToken, balanceOf), [balanceOf, inputToken])

  const { data: allowance } = useERC20Allowance(inputToken.address, address, outputToken.address)

  const { write: approve, data: approveTransaction } = useERC20ApproveCallback(
    inputToken.address,
    outputToken.address,
    inputAmount?.quotient?.toString() ?? "0"
  )

  const { isLoading: isApproveLoading } = useWaitForTransaction({
    ...approveTransaction,
    confirmations: 1,
    onSuccess() {
      toast.success(`Approved!`)
    },
  })

  const { write: deposit, data: depositTransaction } = useVaultDeposit(
    outputToken.address,
    inputAmount?.quotient?.toString() ?? "0",
    address
  )

  const { isLoading: isDepositLoading } = useWaitForTransaction({
    ...depositTransaction,
    confirmations: 1,
    onSuccess() {
      toast.success(`Wrapped!`)
    },
  })

  type PledgeState = "approve" | "commit"
  const state = useMemo<PledgeState>(() => {
    if (!inputAmount?.greaterThan(0)) {
      return "approve"
    }

    const insufficientApproval =
      allowance &&
      inputAmount &&
      CurrencyAmount.fromRawAmount(inputToken, allowance.toString()).lessThan(inputAmount)
    if (insufficientApproval) {
      return "approve"
    }

    return "commit"
  }, [allowance, inputAmount, inputToken])

  return (
    <VStack spacing={6} p={[4, null, 8]} align="start">
      <Box>
        <Shimmer as="h1" size="lg" lineHeight={0.9} pt={4}>
          your ultra-sound money
        </Shimmer>
        <Heading as="h3" size="md" lineHeight={1}>
          can summon carbon rocks
        </Heading>
        <Shimmer as="h1" size="xl" lineHeight={0.9} pt={2} mt={1}>
          from the ether
        </Shimmer>
      </Box>

      <VStack align="start">
        <Heading as="h3" size="xs">
          How does it work?
        </Heading>
        <OrderedList fontSize="lg" spacing={2} pl={7}>
          <ListItem>
            Wrap 1 stETH for 1 {outputToken.symbol}
            <Text fontSize="md" color="purple.400" fontFamily="cursive">
              While in the vault, your stETH yield is pledged to our mission!
            </Text>
          </ListItem>
          <ListItem>
            Together we support permanent carbon locking magic
            <Text fontSize="md" color="purple.400" fontFamily="cursive">
              Get ednEARTH carbon impact certificates to go climate positive!
            </Text>
          </ListItem>
          <ListItem>
            Your ultra-sound money makes rock-solid climate impact
            <Text fontSize="md" color="purple.400" fontFamily="cursive">
              At anytime, unwrap your stETH and get back exactly what you put in!
            </Text>
          </ListItem>
        </OrderedList>
      </VStack>

      <Alert
        status="warning"
        color="orange.600"
        borderRadius="lg"
        animation="pulser-cw 10s ease-in-out infinite alternate"
      >
        <AlertIcon />
        <AlertTitle fontSize={["sm", "md"]}>You need ≥0.01 {inputToken.symbol}</AlertTitle>
        <Button
          ml="auto"
          size="sm"
          as={Link}
          isExternal
          variant="solid"
          colorScheme="orange"
          href={`https://app.uniswap.org/#/swap?outputCurrency=${inputToken.address}`}
          _hover={{ textDecoration: "none" }}
          rightIcon={<HiExternalLink />}
        >
          Lucky ~4% discount!
        </Button>
      </Alert>

      <VStack as={RadiantBackground} w="100%" p={8} spacing={5} borderRadius="2xl">
        <Stack
          direction={["column", null, "row"]}
          align="center"
          spacing={4}
          justify="space-between"
          w="100%"
          color="white"
        >
          <VStack>
            <HStack w="100%" spacing={1} justify="space-between">
              <Text as="label" htmlFor="input" fontWeight="bold">
                {inputToken.symbol}
              </Text>
              {maxCommit && (
                <ButtonGroup size="sm" colorScheme="whiteAlpha">
                  <Button
                    onClick={() => {
                      setFormattedAmount(maxCommit.multiply(new Fraction(1, 4)).toFixed(6))
                    }}
                  >
                    25%
                  </Button>
                  <Button
                    onClick={() => {
                      setFormattedAmount(maxCommit.multiply(new Fraction(1, 2)).toFixed(6))
                    }}
                  >
                    50%
                  </Button>
                  <Button onClick={() => setFormattedAmount(maxCommit.toFixed(6))}>max</Button>
                </ButtonGroup>
              )}
            </HStack>
            <NumberInput
              id="input"
              value={formattedAmount}
              onChange={(value: string) => setFormattedAmount(value || "0")}
              size="lg"
              step={1}
              min={0.001}
              max={Number(maxCommit?.toFixed(6))}
              precision={6}
              focusBorderColor="white"
              errorBorderColor="orange.600"
              clampValueOnBlur
            >
              <NumberInputField
                py={7}
                fontWeight="bold"
                textAlign="right"
                autoFocus
                disabled={isApproveLoading || isDepositLoading}
              />
            </NumberInput>
          </VStack>
          {/* <HiOutlineArrowRight size={24} /> */}

          <GiMagicGate size={42} />

          <GiAllSeeingEye size={42} />

          <VStack>
            <Text fontWeight="bold">{outputToken.symbol}</Text>
            <NumberInput id="output" size="lg" maxW={180} value={inputAmount?.toFixed(6)}>
              <NumberInputField
                borderColor="purple.300"
                fontWeight="bold"
                pointerEvents="none"
                py={7}
              />
            </NumberInput>
          </VStack>
        </Stack>
        <ButtonGroup size="lg" colorScheme="whiteAlpha" w="100%" spacing={6}>
          <Button
            flex={1}
            disabled={state === "commit" || formattedAmount == "0" || isApproveLoading}
            onClick={() => approve()}
            isLoading={isApproveLoading}
          >
            Approve
          </Button>
          <Button
            flex={1}
            disabled={state === "approve" || isDepositLoading}
            onClick={() => deposit()}
            isLoading={isDepositLoading}
          >
            Wrap
          </Button>
        </ButtonGroup>
      </VStack>

      <Text fontSize="sm" color="purple.400">
        By depositing into Eden Dao&rsquo;s Vault contract at Ethereum address (
        {outputToken.address}) you, the Contributor, donate the yield on your {inputToken.name} (
        {inputToken.symbol}) in order to receive {outputToken.symbol} tokens solely for the
        Contributor’s own benefit and account, for the purposes of personal consumption and
        utilization of {outputToken.symbol} tokens on Ethereum and not for any speculative purpose
        or with an expectation of profit, and not with a view to, or for resale in connection with,
        a public offering or other distribution of {outputToken.symbol} tokens, whether in exchange
        for other any other digital asset, any currency, any security or otherwise, and all of the
        foregoing remains true, accurate and complete on and as of the date of the contribution.
      </Text>
    </VStack>
  )
}

export default Card
