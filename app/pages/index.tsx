import { Heading, Link, List, ListItem, VStack } from "@chakra-ui/react"
import { Link as BlitzLink, Routes, dynamic } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import Layout from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import React, { useCallback, useState } from "react"

const GreenlistGate = dynamic(() => import("ds/molecules/GreenlistGate"))

export const MembersPage: React.FC = () => {
  type State = "0connect" | "1greenlist" | "2members"
  const [state, setState] = useState<State>("0connect")

  const goToGreenlist = useCallback(() => setState("1greenlist"), [setState])
  const unlock = useCallback(() => setState("2members"), [setState])

  return (
    <Layout title="Members">
      <VStack spacing={8} py={[8, 16, 24]} maxW="2xl" mx="auto">
        {state === "0connect" ? (
          <Connector text="access your members page" next={goToGreenlist} />
        ) : state === "1greenlist" ? (
          <GreenlistGate next={unlock} cta="access members page" />
        ) : (
          <>
            <Shimmer size="lg" pr={1}>
              welcome, member
            </Shimmer>
            <VStack spacing={2} align="start" fontSize="xl">
              <Heading fontWeight="bold" size="xs">
                Member Benefits
              </Heading>
              <List spacing={0}>
                <ListItem
                  p={1}
                  _hover={{ transform: "translateX(2%)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.CarbonFootprint().pathname} passHref>
                    <Link>
                      Carbon Footprint (tCO<sub>2</sub>)
                    </Link>
                  </BlitzLink>
                </ListItem>
                <ListItem
                  p={1}
                  _hover={{ transform: "translateX(2%)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.CarbonPositive().pathname} passHref>
                    <Link>Carbon Positive (carbon ton&ndash;years)</Link>
                  </BlitzLink>
                </ListItem>
                <ListItem
                  p={1}
                  _hover={{ transform: "translateX(2%)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.STETHVault().pathname} passHref>
                    <Link>stETH Vault</Link>
                  </BlitzLink>
                </ListItem>
              </List>
            </VStack>
          </>
        )}
      </VStack>
    </Layout>
  )
}

export default MembersPage
