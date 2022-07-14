import { Heading, Image, StackProps, VStack } from "@chakra-ui/react"
import { tonYearsToCO2, tonYearsToUSD } from "app/core/carbon"

interface MintProps extends StackProps {
  image: string
  debt: number
  next: (data: any) => void
}

export const Mint: React.FC<MintProps> = ({ next, image, debt, ...props }) => {
  const [minusd, maxusd] = tonYearsToUSD(debt)

  return (
    <VStack align="start" spacing={8} px={[2, 4, 8, 12]} py={[4, 8]} {...props}>
      <Heading fontFamily="cursive" fontWeight="normal" size="md" lineHeight={1}>
        {debt.toLocaleString()} DEBT = USD {minusd.toLocaleString()}
        &ndash;{maxusd.toLocaleString()}
      </Heading>
      <Image rounded="full" src={image} w={256} alt="Your Passport ID" />
    </VStack>
  )
}

export default Mint
