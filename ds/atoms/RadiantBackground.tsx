import { Box, BoxProps } from "@chakra-ui/react"

export const radiantBackground =
  "radial-gradient(at 0% 100%, #e0c38e 0%, #464cc9 40%, #7a5cce 60%, #54b0a2 100%) fixed"

export const RadiantBackground: React.FC<BoxProps> = (props) => <Box {...props} />

RadiantBackground.defaultProps = {
  background: radiantBackground,
}

export const AbsoluteRadiantBackground: React.FC<BoxProps> = (props) => <Box {...props} />

AbsoluteRadiantBackground.defaultProps = {
  ...RadiantBackground.defaultProps,
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: -1,
}
