import { Box, BoxProps } from "@chakra-ui/react"
import { Head } from "blitz"
import React from "react"

import { Footer } from "./molecules/Footer"

interface LayoutProps extends BoxProps {
  children?: React.ReactNode
  title?: string
}

export const Layout: React.FC<LayoutProps> = ({ title, children, ...boxProps }) => (
  <>
    <Head>
      <title>{title ? `${title} | spirals protocol` : "spirals protocol"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Box mt={24} {...boxProps}>
      {children}
    </Box>
    <Footer />
  </>
)

export default Layout
