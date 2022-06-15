import {
  Button,
  HStack,
  Heading,
  Link,
  List,
  ListIcon,
  ListItem,
  NumberInput,
  NumberInputField,
  OrderedList,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ButtonGroup } from "@chakra-ui/react"
import { CurrencyAmount, Fraction, Token } from "@uniswap/sdk-core"
import { gCO2toTonYears } from "app/core/carbon-math"
import {
  useERC20Allowance,
  useERC20ApproveCallback,
  useERC20BalanceOf,
} from "app/core/hooks/web3/useERC20"
import getCachedTransactions from "app/ethereum/queries/getCachedTransactions"
import { useQuery } from "blitz"
import { BigNumber } from "ethers"
import { Result } from "ethers/lib/utils"
import sumBy from "lodash/sumBy"
import React, { useMemo, useState } from "react"
import { GiFireAce, GiHeartWings, GiSpiralBottle, GiStripedSun } from "react-icons/gi"
import { HiOutlineArrowRight } from "react-icons/hi"
import { useAccount } from "wagmi"

interface CommitProps {
  next: () => void
  token: Token
  contractAddress: string
}

export const Commit: React.FC<CommitProps> = ({ next, token, contractAddress }) => {
  const [txs = []] = useQuery(getCachedTransactions, null, { suspense: false })
  const tonYears = useMemo(() => gCO2toTonYears(sumBy(txs, "gCO2")), [txs])

  return (
    <VStack spacing={6} p={[4, null, 8]} align="start">
      <Heading fontFamily="cursive" fontWeight="normal" as="h2" size="lg" lineHeight={1} my={0}>
        rock solid impact pledge
      </Heading>
      <List fontSize="xl" alignItems="start" spacing={2}>
        <ListItem>
          <ListIcon as={GiHeartWings} boxSize={6} mr={3} />
          Level up humanity for the public good
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
          <ListIcon as={GiFireAce} boxSize={6} mr={3} />
          Acquire the ultimate, rock-solid comeback
        </ListItem>
      </List>

      <Depositor token={token} contractAddress={contractAddress} />

      <VStack align="start">
        <Heading as="h3" size="xs">
          How does it work?
        </Heading>
        <OrderedList fontSize="lg" spacing={2} pl={7}>
          <ListItem>Lock your stETH to receive EDEN</ListItem>
          <ListItem>Claim your governance Passport NFT</ListItem>
          <ListItem>Get Vegan Wagyu A5 Future Proof of Impact Carbon Tokens</ListItem>
          <ListItem>On March 20th, 2030, withdraw exactly what you put in today</ListItem>
        </OrderedList>
      </VStack>
      <Text fontSize="sm">
        By making a contribution to Eden Dao&rsquo;s Frontier Pledge you, the Contributor, donate
        the yield on your Lido Staked Ethereum tokens (stETH) in order to receive EDEN tokens solely
        for the Contributor’s own benefit and account, for the purposes of personal consumption and
        utilization of EDEN tokens on Ethereum and not for any speculative purpose or with an
        expectation of profit, and not with a view to, or for resale in connection with, a public
        offering or other distribution of EDEN tokens, whether in exchange for other any other
        digital asset, any currency, any security or otherwise, and all of the foregoing remains
        true, accurate and complete on and as of the date of the contribution.
      </Text>
    </VStack>
  )
}

type DepositorProps = Pick<CommitProps, "token" | "contractAddress">
type DepositorAction = "approve" | "commit"

const toCurrencyAmount = (token: Token, n?: BigNumber | Result | number) =>
  CurrencyAmount.fromRawAmount(token, `${n}`)

const Depositor: React.FC<DepositorProps> = ({ token, contractAddress }) => {
  const [formattedAmount, setFormattedAmount] = useState<string>("0.01")
  const inputAmount = useMemo(
    () => toCurrencyAmount(token, Number(formattedAmount) * 1e18),
    [token, formattedAmount]
  )
  const outputAmount = useMemo(() => inputAmount.multiply(1000), [inputAmount])

  const { data: account } = useAccount()
  const { data: balanceOf } = useERC20BalanceOf(token.address, account?.address)
  const maxCommit = useMemo(() => toCurrencyAmount(token, balanceOf), [balanceOf, token])

  const { data: allowance } = useERC20Allowance(token.address, account?.address, contractAddress)

  const { write: approve, isLoading: isApproveLoading } = useERC20ApproveCallback(
    token.address,
    contractAddress,
    inputAmount.quotient.toString()
  )

  const state = useMemo<DepositorAction>(() => {
    const needsApproval =
      allowance && CurrencyAmount.fromRawAmount(token, allowance.toString()).lessThan(inputAmount)

    if (needsApproval || inputAmount.equalTo(0)) {
      return "approve"
    }

    return "commit"
  }, [allowance, inputAmount, token])

  return (
    <VStack
      w="100%"
      p={[2, 3, 5, 8]}
      spacing={5}
      color="white"
      className="radiant-bg"
      borderRadius="2xl"
    >
      <HStack align="center" spacing={1} justify="space-between" w="100%">
        <NumberInput
          id="input"
          value={formattedAmount}
          onChange={(value: string) => setFormattedAmount(value || "0")}
          size="lg"
          maxW={180}
          step={1}
          min={0.001}
          max={Number(maxCommit?.toFixed(6))}
          precision={6}
          focusBorderColor="white"
          clampValueOnBlur
        >
          <NumberInputField py={7} fontWeight="bold" textAlign="right" autoFocus />
        </NumberInput>
        <VStack spacing={1}>
          <Text as="label" htmlFor="input" fontWeight="bold">
            {token.symbol}
          </Text>
          {/* <Select size="lg" variant="unstyled" pl={4}>
            <option value="stETH" defaultChecked>
              stETH
            </option>
            <option value="eth">ETH</option>
          </Select> */}
          {maxCommit?.greaterThan(new Fraction(1, 100)) && (
            <Button
              size="sm"
              w="100%"
              colorScheme="whiteAlpha"
              onClick={() => setFormattedAmount(maxCommit!.toFixed(6))}
            >
              max
            </Button>
          )}
        </VStack>
        <HiOutlineArrowRight size={24} />
        <Text
          as="label"
          htmlFor="output"
          pointerEvents="none"
          fontFamily="cursive"
          fontSize="3xl"
          lineHeight={0.9}
        >
          eden
        </Text>
        <NumberInput id="output" size="lg" maxW={180} value={outputAmount.toFixed(3)}>
          <NumberInputField
            borderColor="purple.300"
            fontWeight="bold"
            pointerEvents="none"
            py={7}
          />
        </NumberInput>
      </HStack>
      <ButtonGroup size="lg" colorScheme="whiteAlpha" w="100%" spacing={6}>
        <Button
          flex={1}
          disabled={state === "commit" || formattedAmount == "0" || isApproveLoading}
          onClick={() => approve()}
        >
          Approve
        </Button>
        <Button flex={1} disabled={state === "approve"}>
          Commit
        </Button>
      </ButtonGroup>
    </VStack>
  )
}
