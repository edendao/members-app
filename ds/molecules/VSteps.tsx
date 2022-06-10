import { Center, Circle, Container, ContainerProps, Icon, SquareProps } from "@chakra-ui/react"
import { BoxProps, Divider, Stack, Text } from "@chakra-ui/react"
import React, { useState } from "react"
import { HiCheck } from "react-icons/hi"

interface VStepsProps extends ContainerProps {
  steps: { title: string; description: string }[]
}

export const VSteps: React.FC<VStepsProps> = ({ steps, ...props }) => {
  const [currentStep, setStep] = useState(0)

  return (
    <Container py={{ base: "4", md: "8" }} {...props}>
      <Center>
        <Stack spacing="0">
          {steps.map((step, id) => (
            <Step
              key={id}
              cursor="pointer"
              onClick={() => setStep(id)}
              title={step.title}
              description={step.description}
              isActive={currentStep === id}
              isCompleted={currentStep > id}
              isLastStep={steps.length === id + 1}
            />
          ))}
        </Stack>
      </Center>
    </Container>
  )
}

interface RadioCircleProps extends SquareProps {
  isCompleted: boolean
  isActive: boolean
}

export const StepCircle: React.FC<RadioCircleProps> = (props) => {
  const { isCompleted, isActive } = props
  return (
    <Circle
      size="8"
      bg={isCompleted ? "accent" : "inherit"}
      borderWidth={isCompleted ? "0" : "2px"}
      borderColor={isActive ? "accent" : "inherit"}
      {...props}
    >
      {isCompleted ? (
        <Icon as={HiCheck} color="inverted" boxSize="5" />
      ) : (
        <Circle bg={isActive ? "accent" : "border"} size="3" />
      )}
    </Circle>
  )
}

interface StepProps extends BoxProps {
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
  isLastStep: boolean
}

export const Step: React.FC<StepProps> = (props) => {
  const { isActive, isCompleted, isLastStep, title, description, ...stackProps } = props

  return (
    <Stack spacing="4" direction="row" {...stackProps}>
      <Stack spacing="0" align="center">
        <StepCircle isActive={isActive} isCompleted={isCompleted} />
        <Divider
          orientation="vertical"
          borderWidth="1px"
          borderColor={isCompleted ? "accent" : isLastStep ? "transparent" : "inherit"}
        />
      </Stack>
      <Stack spacing="0.5" pb={isLastStep ? "0" : "8"}>
        <Text color="emphasized" fontWeight="medium">
          {title}
        </Text>
        <Text color="muted">{description}</Text>
      </Stack>
    </Stack>
  )
}
