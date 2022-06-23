import { Interface } from "ethers/lib/utils"
import toast from "react-hot-toast"
import { useContractRead, useContractWrite } from "wagmi"

export const contractInterface = new Interface([
  "function balanceOf(address owner) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
])

export const useERC20BalanceOf = (addressOrName: string, owner?: string) =>
  useContractRead({ addressOrName, contractInterface }, "balanceOf", {
    args: [owner],
    enabled: Boolean(owner),
    watch: true,
  })

export const useERC20Allowance = (addressOrName: string, owner?: string, spender?: string) =>
  useContractRead({ addressOrName, contractInterface }, "allowance", {
    args: [owner, spender],
    watch: true,
    enabled: Boolean(owner) && Boolean(spender),
  })

export const useERC20ApproveCallback = (addressOrName: string, spender: string, amount: string) =>
  useContractWrite({ addressOrName, contractInterface }, "approve", {
    args: [spender, amount],
    onError(error) {
      toast.error(error.message)
    },
  })
