import { Box, Heading, Icon, Image } from "@chakra-ui/react"
import { Link } from "blitz"
import { RadiantBackground } from "ds/atoms/RadiantBackground"
import { FaDiscord, FaTwitter } from "react-icons/fa"

export const Footer: React.FC = () => (
  <>
    <RadiantBackground minH="120px" w="100vw" h="15vh" />
    <Box
      minH="80px"
      w="100vw"
      h="15vh"
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
      <Heading
        fontFamily="body"
        color="white"
        size="sm"
        textAlign="center"
        style={{ fontSize: "120%", margin: "auto" }}
      >
        Built by Spirals and The Eden DAO
      </Heading>
    </Box>
  </>
)
