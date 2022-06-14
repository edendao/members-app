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
  Text,
  VStack,
} from "@chakra-ui/react"
import { ButtonGroup } from "@chakra-ui/react"
import getCachedTransactions from "app/ethereum/queries/getCachedTransactions"
import { COOKIE_ANONYMOUS_SESSION_TOKEN, useQuery } from "blitz"
import { BigNumber } from "ethers"
import { Interface } from "ethers/lib/utils"
import React, { useMemo, useState } from "react"
import toast from "react-hot-toast"
import { GiFireAce, GiHeartWings, GiSpiralBottle, GiStripedSun } from "react-icons/gi"
import { HiOutlineArrowRight } from "react-icons/hi"
import { useAccount, useBalance, useContractRead, useContractWrite } from "wagmi"

export const Commit: React.FC<{ next: () => void }> = ({ next }) => {
  const [txs = []] = useQuery(getCachedTransactions, null, { suspense: false })

  const tonYearsOfAtmosphericImpact = useMemo(
    () => (txs.reduce((sum, tx) => sum + (tx.gCO2 ?? 0), 0) * 310.16) / 1_000_000,
    [txs]
  )

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

      <StakedEthereumDepositor />

      <VStack align="start">
        <Heading as="h3" size="xs">
          How does it work?
        </Heading>
        <OrderedList fontSize="lg" spacing={2} pl={7}>
          <ListItem>Lock your stETH to receive EDEN</ListItem>
          <ListItem>Claim your Governance NFT (Coming Soon)</ListItem>
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

type State = "approve" | "commit"

const balanceOfInterface = new Interface([
  "function balanceOf(address owner) external view returns (uint256)",
])

const useBalanceOf = (addressOrName: string, owner?: string) =>
  useContractRead({ addressOrName, contractInterface: balanceOfInterface }, "balanceOf", {
    args: [owner],
    enabled: Boolean(owner),
    watch: true,
  })

const allowanceInterface = new Interface([
  "function allowance(address owner, address spender) external view returns (uint256)",
])

const useAllowance = (addressOrName: string, owner?: string, spender?: string) =>
  useContractRead({ addressOrName, contractInterface: allowanceInterface }, "allowance", {
    args: [owner, spender],
    watch: true,
    enabled: Boolean(owner) && Boolean(spender),
  })

const approvalInterface = new Interface([
  "function approve(address spender, uint256 amount) external returns (bool)",
])

const useApprove = (addressOrName: string, spender: string, amount: BigNumber) =>
  useContractWrite({ addressOrName, contractInterface: approvalInterface }, "approve", {
    args: [spender, amount],
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success("Approved!")
    },
  })

const rinkebyWETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab"

const StakedEthereumDepositor: React.FC = () => {
  const { data: account } = useAccount()

  const { data: { decimals = 18 } = {} } = useBalance({ addressOrName: rinkebyWETH })
  const { data: balanceOf, isLoading: isBalanceOfLoading } = useBalanceOf(
    rinkebyWETH,
    account?.address
  )
  const { data: allowance, isLoading: isAllowanceLoading } = useAllowance(
    rinkebyWETH,
    account?.address,
    "0x0000000000000000000000000000000000000000"
  )
  const [amount, setAmount] = useState<number>(0.01)
  const requiresApproval = !allowance || Number(allowance) < amount
  const state = useMemo<State>(
    () => (amount === 0 || requiresApproval ? "approve" : "commit"),
    [amount, requiresApproval]
  )

  const {
    write: approve,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
  } = useApprove(
    rinkebyWETH,
    "0x0000000000000000000000000000000000000000",
    BigNumber.from(amount * 100).mul(BigNumber.from(10).pow(decimals - 2))
  )

  return (
    <VStack
      w="100%"
      p={[2, 3, 5, 8]}
      spacing={5}
      color="white"
      className="radiant-bg"
      borderRadius="2xl"
    >
      <HStack align="center" spacing={2} justify="space-between" w="100%">
        <VStack spacing={0}>
          <Text fontFamily="cursive" fontSize="lg">
            stETH
          </Text>
          <Button
            size="xs"
            w="100%"
            colorScheme="whiteAlpha"
            onClick={() => {
              setAmount(Number(balanceOf) / Number(10 ** decimals))
            }}
          >
            max
          </Button>
        </VStack>
        <NumberInput
          value={amount}
          onChange={(value: string) => {
            if (!value) {
              setAmount(0)
            } else if (parseFloat(value) !== NaN) {
              setAmount(parseFloat(value))
            }
          }}
          size="lg"
          maxW={150}
          step={1}
          min={0.001}
          precision={3}
          focusBorderColor="white"
        >
          <NumberInputField fontWeight="bold" autoFocus />
        </NumberInput>
        <HiOutlineArrowRight size={24} />
        <Text fontFamily="cursive" fontSize="3xl" lineHeight={0.9}>
          eden
        </Text>
        <NumberInput size="lg" maxW={150}>
          <NumberInputField disabled fontWeight="bold" borderColor="purple.300" />
        </NumberInput>
      </HStack>
      <ButtonGroup size="lg" colorScheme="whiteAlpha" w="100%" spacing={5}>
        <Button flex={1} disabled={state === "commit" || amount === 0} onClick={() => approve()}>
          Approve
        </Button>
        <Button flex={1} disabled={state === "approve"}>
          Commit
        </Button>
      </ButtonGroup>
    </VStack>
  )
}
