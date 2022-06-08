import { Heading, HeadingProps } from "@chakra-ui/react"
import { css } from "@emotion/react"

export const Shimmer: React.FC<Omit<HeadingProps, "css">> = (props) => (
  <Heading
    {...props}
    css={css`
      font-family: "Cosplay", serif;
      text-shadow: none;
      background: linear-gradient(
          90deg,
          rgba(35, 13, 151, 0.67) 27%,
          rgba(35, 13, 151, 0.95) 50%,
          rgba(35, 13, 151, 0.7) 63%
        )
        white;
      background-size: 200% auto;
      background-clip: text;
      text-fill-color: transparent;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shine reverse 6s linear infinite;

      @keyframes shine {
        to {
          background-position: 200% center;
        }
      }
    `}
  />
)
