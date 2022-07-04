import { Interface } from "ethers/lib/utils"
import toast from "react-hot-toast"
import { useContractRead, useContractWrite } from "wagmi"

export const contractInterface = new Interface([
  "function balanceOf(address owner) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
])

export type ReadParams = Parameters<typeof useContractRead>[2]
export type WriteParams = Parameters<typeof useContractWrite>[2]

export const useERC20BalanceOf = (
  addressOrName: string,
  owner?: string,
  overrides: ReadParams = {}
) =>
  useContractRead({ addressOrName, contractInterface }, "balanceOf", {
    args: [owner],
    enabled: Boolean(owner),
    watch: true,
    ...overrides,
  })

export const useERC20Allowance = (
  addressOrName: string,
  owner?: string,
  spender?: string,
  overrides: ReadParams = {}
) =>
  useContractRead({ addressOrName, contractInterface }, "allowance", {
    args: [owner, spender],
    watch: true,
    enabled: Boolean(owner) && Boolean(spender),
    ...overrides,
  })

export const useERC20ApproveCallback = (
  addressOrName: string,
  spender: string,
  amount: string,
  overrides: WriteParams = {}
) =>
  useContractWrite({ addressOrName, contractInterface }, "approve", {
    args: [spender, amount],
    onError(error) {
      toast.error(error.message)
    },
    ...overrides,
  })
