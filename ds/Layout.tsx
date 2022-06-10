import { Box } from "@chakra-ui/react"
import { Head } from "blitz"
import React from "react"

interface LayoutProps {
  children?: React.ReactNode
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

      <Box
        height={24}
        width="100%"
        background="
          radial-gradient(
            at 0% 100%,
            #e0c38e 0%,
            #464cc9 40%,
            #7A5CCE 60%,
            #54b0a2 100%
          )
          fixed
        "
      />

      {children}
    </>
  )
}

export default Layout
