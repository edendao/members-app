import { Box, Button, Link, StackProps, Text, VStack } from "@chakra-ui/react"
import * as pledge from "app/core/pledge"
import isGreenlisted from "app/core/queries/isGreenlisted"
import { useQuery } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import { useSession } from "ds/molecules/SessionManager"
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

  useEffect(() => {
    if (greenlisted != null) {
      const timeout = greenlisted
        ? setTimeout(() => next({ greenlisted }), 500)
        : setTimeout(pledge.open, 2000)

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
        <Link isExternal href={pledge.url} fontSize="md" fontWeight="semibold">
          {pledge.url.slice(8)}
        </Link>
        <br />
        then, come back to this screen, and you will automatically proceed.
      </Text>
      <Box py={8}>
        {greenlisted ? (
          <Button
            onClick={next}
            colorScheme="purple"
            isLoading={greenlisted}
            loadingText="loading..."
          >
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
