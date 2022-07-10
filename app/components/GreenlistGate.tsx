import { Box, Button, Link, StackProps, Text, VStack } from "@chakra-ui/react"
import { useMount, useTimeout } from "ahooks"
import { useSession } from "app/components/SessionManager"
import { open as openPledge, url as pledgeURL } from "app/core/pledge"
import isGreenlisted from "app/core/queries/isGreenlisted"
import { useQuery } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import React, { useEffect } from "react"
import toast from "react-hot-toast"
import { GiHeartWings, GiMagicGate } from "react-icons/gi"

interface GreenlistGateProps extends StackProps {
  cta: string
  next: (data: any) => void
}

export const GreenlistGate: React.FC<GreenlistGateProps> = ({ cta, next, ...props }) => {
  const { address } = useSession()
  const [greenlisted] = useQuery(isGreenlisted, address, {
    suspense: false,
    enabled: Boolean(address),
  })

  console.log(address, greenlisted)

  useEffect(() => {
    if (greenlisted) {
      toast.success(
        <span>
          greenlisted!
          <br />
          <strong>loading adventure</strong>
        </span>
      )
    }

    if (greenlisted != null) {
      const timeout = setTimeout(greenlisted ? () => next({ greenlisted }) : openPledge, 2000)
      return () => clearTimeout(timeout)
    }
  }, [greenlisted, next])

  return (
    <VStack textAlign="center" spacing={4} {...props}>
      <VStack py={4}>
        <GiHeartWings size={96} />
        <Shimmer size="md">sign our pledge to continue</Shimmer>
      </VStack>
      <Text fontSize="sm" color="purple.500">
        a new browser tab should have opened. if it hasn&rsquo;t, click here:
        <br />
        <Link isExternal href={pledgeURL} fontSize="md" fontWeight="semibold">
          {pledgeURL.slice(8)}
        </Link>
        <br />
        then, come back to this screen, and you will automatically proceed.
      </Text>
      <Box py={8}>
        {greenlisted ? (
          <Button onClick={next} colorScheme="purple">
            {cta}
          </Button>
        ) : (
          <GiMagicGate size={64} />
        )}
      </Box>
    </VStack>
  )
}

export default GreenlistGate
