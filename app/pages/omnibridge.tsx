import {
  Box,
  Button,
  HStack,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  NumberInput,
  NumberInputField,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Token } from "@uniswap/sdk-core"
import { toTokenAmount } from "app/core/tokens"
import { BlitzPage } from "blitz"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import { useERC20BalanceOf } from "ds/hooks/web3/useERC20"
import Layout from "ds/Layout"
import { useSession } from "ds/molecules/SessionManager"
import React, { useMemo, useState } from "react"
import { HiChevronDown } from "react-icons/hi"
import { Chain, chain } from "wagmi"

export const Omnibridge: BlitzPage = () => {
  const tokens = [
    new Token(1, "0x0000000000000000000000000000000000000000", 18, "CRED", "CRED"),
    new Token(1, "0x0000000000000000000000000000000000000000", 18, "EDN", "EDN"),
  ]
  const chains = [chain.mainnet, chain.optimism, chain.polygon]

  return (
    <Layout title="Omnibridge" mt={0}>
      <RadiantBackground id="vault" w="100vw" py={64}>
        <Box mx="auto" maxW={1440}>
          <Widget tokens={tokens} chains={chains} />
        </Box>
      </RadiantBackground>
    </Layout>
  )
}

interface WidgetProps {
  tokens: Token[]
  chains: Chain[]
}

const Widget: React.FC<WidgetProps> = ({ tokens, chains }) => {
  const [token, setToken] = useState(tokens[0]!)
  const [fromChain, setFromChain] = useState(chains[0]!)
  const [toChain, setToChain] = useState(chains[1]!)

  const [formattedAmount, setFormattedAmount] = useState<string>("0.01")
  const inputAmount = useMemo(
    () => toTokenAmount(token, Number(formattedAmount) * 1e18),
    [token, formattedAmount]
  )

  const { address } = useSession()
  const { data: balanceOf } = useERC20BalanceOf(token.address, address)
  const maxCommit = useMemo(() => toTokenAmount(token, balanceOf), [balanceOf, token])

  return (
    <VStack
      p={[4, 6, 12]}
      borderRadius="3xl"
      color="purple.700"
      bg="white"
      w="100%"
      minW="320"
      maxW="3xl"
      mx="auto"
      spacing={4}
      align="start"
    >
      <Heading size="sm">Omnibridge</Heading>
      <HStack>
        <Box>
          <Text>select token</Text>
          <Menu>
            <MenuButton as={Button} rightIcon={<HiChevronDown />}>
              {token.name}
            </MenuButton>
            <MenuList>
              {tokens.map((t) => (
                <MenuItem key={t.address} onClick={() => setToken(t)}>
                  {t.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

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
          <NumberInputField py={7} fontWeight="bold" textAlign="right" autoFocus />
        </NumberInput>
      </HStack>
      <Box>
        <Text>send from</Text>
        <Menu>
          <MenuButton as={Button} rightIcon={<HiChevronDown />}>
            {fromChain.name}
          </MenuButton>
          <MenuList>
            {chains.map((c) => (
              <MenuItem key={c.id} onClick={() => setFromChain(c)}>
                {c.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
      <Box>
        <Text>to network</Text>
        <Menu>
          <MenuButton as={Button} rightIcon={<HiChevronDown />}>
            {toChain.name}
          </MenuButton>
          <MenuList>
            {chains.map((c) => (
              <MenuItem key={c.id} onClick={() => setToChain(c)}>
                {c.name}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Box>
    </VStack>
  )
}

export default Omnibridge
