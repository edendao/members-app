import { CurrencyAmount, Token } from "@uniswap/sdk-core"
import { BigNumber } from "ethers"
import { Result } from "ethers/lib/utils"
import { chain } from "wagmi"

export const toTokenAmount = (token: Token, n?: BigNumber | Result | number | string) =>
  n == null ? null : CurrencyAmount.fromRawAmount(token, `${n}`)

export const INPUT_TOKEN = {
  [chain.mainnet.id]: new Token(
    chain.mainnet.id,
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    18,
    "stETH",
    "Lido Staked ETH"
  ),
  [chain.rinkeby.id]: new Token(
    chain.rinkeby.id,
    "0xa5EDb37Ec240bbbF3BB9CeC1119CDD81400b7b98",
    18,
    "stETH",
    "Test Lido Staked ETH"
  ),
} as const

export const OUTPUT_TOKEN = {
  [chain.mainnet.id]: new Token(
    chain.mainnet.id,
    "0x0000000000000000000000000000000000000000",
    18,
    "edenETH",
    "eden dao ETH"
  ),
  [chain.rinkeby.id]: new Token(
    chain.rinkeby.id,
    "0x7212523d9d85db47c15694a73042f24ac47946c2",
    18,
    "edenETH",
    "eden dao ETH"
  ),
} as const
