import { Heading, HeadingProps } from "@chakra-ui/react"
import { css } from "@emotion/react"

export const shimmerBackground = `
linear-gradient(
  90deg,
  rgba(35, 13, 151, 0.67) 27%,
  rgba(35, 13, 151, 0.95) 50%,
  rgba(35, 13, 151, 0.7) 63%
)
white`

export const shimmerCSS = css`
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine reverse 5s linear infinite;

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`

export const Shimmer: React.FC<Omit<HeadingProps, "css">> = (props) => (
  <Heading {...props} css={shimmerCSS} />
)

Shimmer.defaultProps = {
  background: shimmerBackground,
  backgroundSize: "200% auto",
  backgroundClip: "text",
  fontFamily: "cursive",
  fontWeight: "normal",
  lineHeight: 1,
  textShadow: "none",
}
