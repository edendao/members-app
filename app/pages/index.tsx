import { Heading } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { Session, getSession } from "blitz"

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const privateData = await session.$getPrivateData()
  return {
    props: { session: privateData },
  }
}

interface HomeProps {
  session: Session
}

const Home: React.FC<HomeProps> = ({ session }) => {
  return (
    <Layout session={session}>
      <Heading fontFamily="Cosplay">Ethereum&rsquo;s net-zero Proof of Work</Heading>
    </Layout>
  )
}

export default Home
