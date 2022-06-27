import {
  Alert,
  AlertIcon,
  Button,
  ButtonGroup,
  HStack,
  Link,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CurrencyAmount, Fraction, Token } from "@uniswap/sdk-core"
import {
  useERC20Allowance,
  useERC20ApproveCallback,
  useERC20BalanceOf,
} from "app/core/hooks/web3/useERC20"
import { useVaultDeposit } from "app/core/hooks/web3/useVault"
import { toTokenAmount } from "app/core/tokens"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import React, { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { GiAllSeeingEye, GiMagicGate } from "react-icons/gi"
import { HiExternalLink } from "react-icons/hi"
import { useAccount, useWaitForTransaction } from "wagmi"

interface LidoVaultProps {
  inputToken: Token
  outputToken: Token
}

export const LidoVault: React.FC<LidoVaultProps> = ({ inputToken, outputToken }) => {
  const [formattedAmount, setFormattedAmount] = useState<string>("0.01")
  const inputAmount = useMemo(
    () => toTokenAmount(inputToken, Number(formattedAmount) * 1e18),
    [inputToken, formattedAmount]
  )

  const { data: account } = useAccount()
  const { data: balanceOf } = useERC20BalanceOf(inputToken.address, account?.address)
  const maxCommit = useMemo(() => toTokenAmount(inputToken, balanceOf), [balanceOf, inputToken])

  const { data: allowance } = useERC20Allowance(
    inputToken.address,
    account?.address,
    outputToken.address
  )

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
    account?.address
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

  const isInvalidAmount = useMemo(() => inputAmount?.lessThan(1e16), [inputAmount])

  return (
    <VStack
      as={RadiantBackground}
      w="100%"
      p={[2, 3, 5, 8]}
      spacing={5}
      color="white"
      borderRadius="2xl"
    >
      <Alert
        status="warning"
        color="orange.600"
        fontWeight="bold"
        borderRadius="lg"
        animation={isInvalidAmount ? "pulser-cw 5s ease-in-out infinite alternate" : ""}
      >
        {isInvalidAmount && (
          <>
            <AlertIcon />
            <Text>You need ≥0.01 {inputToken.symbol}.</Text>
          </>
        )}
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
          Lucky 5% discount on Uniswap!
        </Button>
      </Alert>

      <HStack align="center" spacing={4} justify="space-between" w="100%">
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
      </HStack>
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
  )
}
