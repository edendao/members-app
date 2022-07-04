import { Interface } from "ethers/lib/utils"
import toast from "react-hot-toast"
import { useContractRead, useContractWrite } from "wagmi"

export const contractInterface = new Interface([
  "function balanceOf(address owner) external view returns (uint256)",
  "function deposit(uint256 amount, address receiver) external returns (uint256 shares)",
  "function withdraw(uint256 amount, address receiver, address owner) external returns (uint256 shares)",
])

export const useVaultBalanceOf = (addressOrName: string, owner?: string) =>
  useContractRead({ addressOrName, contractInterface }, "balanceOf", {
    args: [owner],
    enabled: Boolean(owner),
    watch: true,
  })

export const useVaultDeposit = (addressOrName: string, amount?: string, receiver?: string) =>
  useContractWrite({ addressOrName, contractInterface }, "deposit", {
    args: [amount, receiver],
    onError(error) {
      toast.error(error.message)
    },
  })

export const useVaultWithdraw = (
  addressOrName: string,
  amount?: string,
  receiver?: string,
  owner?: string
) =>
  useContractWrite({ addressOrName, contractInterface }, "withdraw", {
    args: [amount, receiver, owner],
    onError(error) {
      toast.error(error.message)
    },
  })
