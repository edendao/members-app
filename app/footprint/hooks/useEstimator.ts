import { Transaction } from "@prisma/client"
import { invoke, useQuery } from "blitz"
import { useSession } from "ds/molecules/SessionManager"
import { startTransition, useEffect, useState } from "react"

import getAllTransactions from "../queries/getAllTransactions"
import getEstimateForTransaction from "../queries/getEstimateForTransaction"

export const useEstimator = (
  txlimit: number,
  endblock: string | number | undefined,
  mapping = (n: number) => n,
  onComplete?: () => void
) => {
  const session = useSession()
  const [txs = [], txsQuery] = useQuery(getAllTransactions, `${endblock}`, {
    enabled: Boolean(session?.address) && Boolean(endblock),
    retry: 2,
    suspense: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const [estimationsCount, setEstimationsCount] = useState<number>(0)
  const [impact, setImpact] = useState<number>(0)

  useEffect(() => {
    if (txlimit === 0 || !txs?.length) return

    let exit = false

    startTransition(() => {
      setImpact(0)
      setEstimationsCount(0)
    })
    ;(async () => {
      let i = 0
      for (const unknowntx of txs) {
        if (exit) return

        // Typescript is being quite... Typescript-y
        const tx = unknowntx as unknown as Transaction
        tx.gCO2 ??= await invoke(getEstimateForTransaction, tx.hash)

        startTransition(() => {
          setImpact((i) => i + mapping(tx.gCO2!))
          setEstimationsCount((c) => c + 1)
        })

        if (++i == txlimit) break
      }
    })()

    return () => {
      exit = true
    }
  }, [txs, onComplete, txlimit, mapping])

  return { txs, txsQuery, impact, estimationsCount }
}
