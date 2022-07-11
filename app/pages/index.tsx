import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Link,
  List,
  ListItem,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import isGreenlisted from "app/core/queries/isGreenlisted"
import { Link as BlitzLink, Routes, useQuery } from "blitz"
import { AbsoluteRadiantBackground } from "ds/atoms/RadiantBackground"
import { Shimmer } from "ds/atoms/Shimmer"
import Layout from "ds/Layout"
import { Connector } from "ds/molecules/Connector"
import GreenlistGate from "ds/molecules/GreenlistGate"
import { useSession } from "ds/molecules/SessionManager"
import React, { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { GiAllSeeingEye } from "react-icons/gi"
import Typist from "react-typist"

export const Index: React.FC = () => {
  type State = "0connect" | "1edendao" | "2greenlist" | "3members"
  const [state, setState] = useState<State>("0connect")

  const discoverEdenDao = useCallback(() => setState("1edendao"), [setState])
  const goToGreenlist = useCallback(() => setState("2greenlist"), [setState])
  const goToMembers = useCallback(() => setState("3members"), [setState])

  return (
    <Layout title="Members" mt={0}>
      <Flex
        position="relative"
        overflow="hidden"
        direction="column"
        w="100vw"
        px={[2, 3, 4, 8]}
        pt="10vh"
        pb="20vh"
      >
        <AbsoluteRadiantBackground />

        <Flex
          minH="500"
          w="90vh"
          maxW="2xl"
          mx="auto"
          p={[4, 8, 16]}
          borderRadius="100%"
          boxShadow="inner"
          bg="white"
          alignItems="center"
          justifyContent="center"
        >
          {state === "0connect" ? (
            <Connector text="access your members page" next={discoverEdenDao} />
          ) : state === "1edendao" ? (
            <EdenDao next={goToGreenlist} />
          ) : state === "2greenlist" ? (
            <GreenlistGate next={goToMembers} cta="access members page" />
          ) : (
            <VStack spacing={6} w="100%">
              <GiAllSeeingEye size={56} />
              <Shimmer size="lg" px={1}>
                member portal
              </Shimmer>
              <List spacing={0} textAlign="center">
                <ListItem
                  p={1}
                  _hover={{ transform: "translateY(-0.2em)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.PassportPhoto().pathname} passHref>
                    <Link>Orbify your PFP</Link>
                  </BlitzLink>
                </ListItem>
                <ListItem
                  p={1}
                  _hover={{ transform: "translateY(-0.2em)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.NetZero().pathname} passHref>
                    <Link>
                      Net Zero Calculator (tons of CO<sub>2</sub>)
                    </Link>
                  </BlitzLink>
                </ListItem>
                <ListItem
                  p={1}
                  _hover={{ transform: "translateY(-0.2em)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.CarbonPositive().pathname} passHref>
                    <Link>Carbon Positive Calculator (carbon ton&ndash;years)</Link>
                  </BlitzLink>
                </ListItem>
                <ListItem
                  p={1}
                  _hover={{ transform: "translateY(-0.2em)" }}
                  transition="transform 250ms ease-in-out"
                >
                  <BlitzLink href={Routes.STETHVault().pathname} passHref>
                    <Link>stETH Vault</Link>
                  </BlitzLink>
                </ListItem>
              </List>
            </VStack>
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}

interface EdenDaoProps extends StackProps {
  next: (data?: any) => void
}

const EdenDao: React.FC<EdenDaoProps> = ({ next, ...stackProps }) => {
  useEffect(() => {
    toast.success(
      <>
        <strong>lfg!</strong>&nbsp;discovered eden dao
      </>
    )
  }, [])

  const { address } = useSession()
  const [greenlisted] = useQuery(isGreenlisted, address, {
    suspense: false,
    enabled: Boolean(address),
  })

  useEffect(() => {
    if (greenlisted) {
      next()
    }
  }, [greenlisted, next])

  return (
    <Typist cursor={{ show: false }} avgTypingDelay={50} stdTypingDelay={25}>
      <VStack spacing={[6, 8]} align="center" {...stackProps}>
        <Shimmer size="md" px={4}>
          welcome padawan
        </Shimmer>
        <Typist.Delay ms={2000} />
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          CHAPTER ONE:
          <br />
          <Typist.Delay ms={500} />
          <Shimmer as="span" size="sm" px={4}>
            web3 goes rock solid carbon positive
          </Shimmer>
        </Text>
        <Typist.Delay ms={2000} />
        <Box textAlign="center" w="100%">
          <Shimmer size="md">
            bloom a regenerative renaissance
            <br />
            for the next millenium!
          </Shimmer>
        </Box>
        <Typist.Delay ms={1000} />
        <VStack spacing={4}>
          <Alert status="warning" borderRadius="lg" color="orange.600" fontSize="lg">
            <AlertIcon />
            <AlertDescription>new mission:&nbsp;</AlertDescription>
            <AlertTitle>sign PLEDGE</AlertTitle>
          </Alert>
          <Typist.Delay ms={500} />
          <Button
            as={Link}
            isExternal
            target="_blank"
            variant="solid"
            colorScheme="purple"
            size="lg"
            _hover={{ textDecoration: "none" }}
            onClick={next}
          >
            go to PLEDGE
          </Button>
        </VStack>
      </VStack>
    </Typist>
  )
}

export default Index
