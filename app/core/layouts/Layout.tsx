import { Box, Container } from "@chakra-ui/react"
import { Head } from "blitz"
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
      <Box as="nav" bg="purple.700">
        <Container py={6} px={8} maxW="6xl"></Container>
      </Box>
      {children}
    </>
  )
}

export default Layout
