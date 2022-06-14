import { Box, BoxProps } from "@chakra-ui/react"
import { Image } from "blitz"
import RasterBee from "public/raster-bee.png"
import React from "react"

export const Bee: React.FC<BoxProps> = (props) => (
  <Box
    id="bee"
    position="relative"
    w="100vw"
    minH={["20vh", null, null, "50vh", "70vh", "100vh"]}
    color="white"
    p={0}
    {...props}
  >
    <Box
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
      zIndex="-1"
      className="radiant-bg"
    />
    <Box position="absolute" top="0" right="0" height="100%">
      <Image src={RasterBee} alt="What does it mean to leave a light touch on this Earth?" />
    </Box>
  </Box>
)
