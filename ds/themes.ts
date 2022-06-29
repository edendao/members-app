import { theme } from "@chakra-ui/pro-theme"
import { extendTheme } from "@chakra-ui/react"
import { StyleFunctionProps } from "@chakra-ui/theme-tools"
import { darkTheme } from "@rainbow-me/rainbowkit"

export const edenChakraTheme = extendTheme(
  {
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          color: "#3e139c",
          bg: "white",
        },
      }),
    },
    fonts: {
      cursive: "Cosplay, cursive",
    },
    colors: {
      brand: {},
    },
  },
  theme
)

export const edenRainbowKitTheme = darkTheme({
  // accentColor: "#e6ca61",
  // accentColorForeground: "#222",
  fontStack: "rounded",
})
