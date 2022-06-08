import { extendTheme } from "@chakra-ui/react"
import { lightTheme } from "@rainbow-me/rainbowkit"

export const edenChakraTheme = extendTheme({
  fonts: {
    cursive: "Cosplay, cursive",
  },
  colors: {
    brand: {},
  },
})

export const edenRainbowKitTheme = lightTheme({})
