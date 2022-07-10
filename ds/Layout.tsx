import { Head } from "blitz"
import React from "react"

interface LayoutProps {
  children?: React.ReactNode
  title?: string
}

export const Layout: React.FC<LayoutProps> = ({ title, children }) => (
  <>
    <Head>
      <title>{title ? `${title} | eden dao` : "eden dao"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {children}
  </>
)

export default Layout
