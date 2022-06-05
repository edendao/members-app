import { Box, Container, Flex } from "@chakra-ui/react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Head, Image } from "blitz"
import Logo from "public/logo.png"
import React from "react"

interface LayoutProps {
  title?: string
  session: Record<any, any>
}

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "PROOF OF WORK"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box as="nav" bg="#40723e">
        <Container py={6} px={3} maxW="6xl">
          <Flex justify="space-between">
            <Image src={Logo} alt="Eden Dao" height={38} width={42} />
            <ConnectButton />
          </Flex>
        </Container>
      </Box>
      {children}
    </>
  )
}

export default Layout
