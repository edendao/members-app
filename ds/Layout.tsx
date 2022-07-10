import { Box, BoxProps } from "@chakra-ui/react"
import { Head } from "blitz"
import React from "react"

import { Navbar } from "./molecules/Navbar"

interface LayoutProps extends BoxProps {
  children?: React.ReactNode
  title?: string
}

export const Layout: React.FC<LayoutProps> = ({ title, children, ...boxProps }) => (
  <>
    <Head>
      <title>{title ? `${title} | eden dao` : "eden dao"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar />
    <Box mt={64} {...boxProps}>
      {children}
    </Box>
  </>
)

export default Layout
