import Layout from "app/core/layouts/Layout"
import { Session, getSession } from "blitz"

export const getServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res)
  const privateData = await session.$getPrivateData()
  return {
    props: { session: privateData },
  }
}

const Home: React.FC<{ session: Session }> = ({ session }) => {
  return <Layout session={session}></Layout>
}

export default Home
