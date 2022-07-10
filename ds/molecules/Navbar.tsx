import { Box, Heading, Image } from "@chakra-ui/react"
import { Link } from "blitz"
import Logo from "public/logo.png"
import RasterBee from "public/raster-bee.png"

export const Navbar: React.FC = () => (
  <Box
    minH="120px"
    w="100vw"
    h="15vh"
    p={0}
    display="flex"
    flexDirection="row"
    alignItems="center"
    position="fixed"
    top={0}
    zIndex={9000}
    bg="blackAlpha.500"
    backdropFilter="blur(4px)"
    // bg="#9797f2"
  >
    <Box
      ml="10%"
      mr="auto"
      _hover={{ cursor: "pointer", transform: "translateY(-10%)" }}
      transition="all 250ms ease-in-out"
    >
      <Link href="/">
        <Image
          filter="grayscale(100%)"
          display="block"
          src={Logo.src}
          h="3vh"
          minH="40px"
          alt="Eden Dao"
          rounded="full"
          boxShadow="base"
          _hover={{ boxShadow: "xl", filter: "unset" }}
          transition="all 250ms ease-in-out"
        />
      </Link>
    </Box>

    <Heading fontFamily="cursive" color="white" size="md">
      eden dao
    </Heading>
    <Image
      src={RasterBee.src}
      alt="What does it mean to leave a light touch on this Earth?"
      maxH="100%"
      maxW="100%"
    />
  </Box>
)
