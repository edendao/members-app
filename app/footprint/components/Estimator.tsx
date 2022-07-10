import { Box, Button, Heading, Stack, StackProps } from "@chakra-ui/react"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import React from "react"
import { useBlockNumber } from "wagmi"

import { useEstimator } from "../hooks/useEstimator"

interface EstimatorProps extends StackProps {
  cta: string
  symbol: React.ReactElement | string
  mapping: (n: number) => number
  next: (data: any) => void
}

export const Estimator: React.FC<EstimatorProps> = ({
  cta,
  symbol,
  mapping,
  next,
  ...stackProps
}) => {
  const { data: blocknumber } = useBlockNumber({ watch: false })
  const { estimationsCount = 0, impact = 0, txs = [] } = useEstimator(1000, blocknumber, mapping)

  return txs.length === 0 ? null : (
    <Stack
      direction={["column", null, "row"]}
      spacing={4}
      justify="space-between"
      align="center"
      w="100%"
      {...stackProps}
    >
      <Box
        color="white"
        animation="pulser-ccw 10s ease-in-out infinite alternate"
        textAlign="center"
      >
        <Heading fontFamily="cursive" fontWeight="normal" size="md" color="white" lineHeight={1}>
          {impact.toFixed(2)} {symbol}
        </Heading>
        <Heading as="h4" size="xxs">
          from{" "}
          <strong>
            {estimationsCount}/{txs.length}
          </strong>{" "}
          transactions
        </Heading>
      </Box>

      <Button
        size="lg"
        onClick={() => next({ debt: impact })}
        animation="pulser-ccw 3s ease-in-out infinite alternate"
        color="white"
        colorScheme="yellow"
        fontFamily="cursive"
        p={12}
        pb={10}
        fontSize="3xl"
        lineHeight={0.9}
        _active={{ background: radiantBackground }}
      >
        {cta}
      </Button>
    </Stack>
  )
}

export default Estimator
