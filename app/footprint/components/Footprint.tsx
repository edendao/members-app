import {
  Box,
  Button,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Stack,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Image } from "blitz"
import { radiantBackground } from "ds/atoms/RadiantBackground"
import CostOfTCO2 from "public/carbonplan-cost-of-tCO2.png"
import React from "react"
import { HiExternalLink } from "react-icons/hi"
import { useBlockNumber } from "wagmi"

import { useEstimator } from "../hooks/useEstimator"

interface FootprintProps extends StackProps {
  next: (data: any) => void
}

export const Footprint: React.FC<FootprintProps> = ({ next, ...stackProps }) => {
  const { data: blocknumber } = useBlockNumber({ watch: false })
  const {
    estimationsCount = 0,
    tonYearsOfAtmosphericImpact = 0,
    txs = [],
  } = useEstimator(1000, blocknumber)

  const cta = "find nirvana"

  return (
    <VStack align="start" spacing={8} px={[0, 2, 4, 8]} {...stackProps}>
      {txs.length === 0 ? (
        "No transactions found!"
      ) : (
        <Stack
          direction={["column", null, "row"]}
          spacing={4}
          justify="space-between"
          align="center"
          w="100%"
        >
          <Box
            color="white"
            animation="pulser-ccw 10s ease-in-out infinite alternate"
            textAlign="center"
          >
            <Heading as="h4" size="xxs" mb={2}>
              from{" "}
              <strong>
                {estimationsCount}/{txs.length}
              </strong>{" "}
              transactions, you&rsquo;ve got
            </Heading>
            <Heading
              fontFamily="cursive"
              fontWeight="normal"
              size="md"
              color="white"
              lineHeight={1}
            >
              {tonYearsOfAtmosphericImpact.toFixed(2)} DEBT
            </Heading>
          </Box>

          <Button
            size="lg"
            onClick={() => next({ debt: tonYearsOfAtmosphericImpact })}
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
      )}
      <VStack align="start" spacing={2} fontSize="sm">
        <Heading size="xs">How does it work?</Heading>
        <Text>DEBT measures your generational impact on atmospheric carbon.</Text>
        <OrderedList spacing={2} pl={5}>
          <ListItem>
            <strong>
              More gas = more CO<sub>2</sub>
            </strong>
            , given your share of Ethereum&rsquo;s emissions&nbsp;
            <Link
              fontSize="xs"
              display="inline-flex"
              color="gray.500"
              isExternal
              textDecoration="underline"
              target="_blank"
              href="https://patchtech.notion.site/Patch-Crypto-Carbon-Accounting-Methodology-f25e2a8dd34e4f55bbd92c9ee38516f9"
            >
              Patch
              <HiExternalLink />
            </Link>
          </ListItem>
          <ListItem>
            <strong>Measures cost</strong> by multiplying by 310.16 years&nbsp;
            <Link
              fontSize="xs"
              display="inline-flex"
              color="gray.500"
              href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
              target="_blank"
              isExternal
              textDecoration="underline"
            >
              (carbon)plan
              <HiExternalLink />
            </Link>
          </ListItem>
        </OrderedList>
      </VStack>
      <Link
        display="block"
        href="https://carbonplan.org/research/ton-year-explainer#:~:text=Using%20the%20same,%C2%A0YEARS)"
        target="_blank"
        isExternal
        transition="transform 200ms ease-in-out infinite alternate"
        _hover={{ transform: "scale(1.05)" }}
      >
        <Image
          src={CostOfTCO2}
          alt="Research shows that 1 tCO2e has 310.16 ton•years of impact on the atmosphere"
        />
      </Link>
    </VStack>
  )
}

export default Footprint
