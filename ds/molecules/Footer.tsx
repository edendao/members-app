import { Box, Heading, Icon, Image } from "@chakra-ui/react"
import { Link } from "blitz"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import { FaDiscord, FaTwitter } from "react-icons/fa"

export const Footer: React.FC = () => (
  <>
    <RadiantBackground minH="120px" w="100vw" h="15vh" />
    <Box
      minH="120px"
      w="100vw"
      h="10vh"
      p={0}
      display="flex"
      flexDirection="row"
      alignItems="center"
      alignContent={"space-between"}
      justifyContent="space-between"
      position="fixed"
      bottom={0}
      zIndex={9000}
      bg="blackAlpha.500"
      // backdropFilter="blur(4px)"
      // bg="#9797f2"
    >
      <Heading fontFamily="body" color="white" size="sm" style={{ padding: 10, fontSize: "15px" }}>
        built by{" "}
        <a href="https://twitter.com/theedendao">
          The Eden Dao <Icon color={"white"} as={FaTwitter} boxSize="6" mx="2" />
        </a>
        x{" "}
        <a href="https://twitter.com/spiralsprotocol">
          Spirals Protocol
          <Icon color={"white"} as={FaTwitter} boxSize="6" mx="2" />
        </a>
      </Heading>

      <a href="https://discord.gg/pvZVJk5MRu">
        <Heading
          fontFamily="body"
          color="white"
          size="sm"
          style={{ padding: 10, fontSize: "15px", right: 0 }}
        >
          Join ReFi DAO <Icon color={"white"} as={FaDiscord} boxSize="6" mx="2" />
        </Heading>
      </a>
    </Box>
  </>
)
