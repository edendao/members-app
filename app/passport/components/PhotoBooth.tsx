/* eslint-disable no-debugger */
import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Progress,
  StackProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { invoke } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import { useBase64ImageFile } from "ds/hooks/useBase64ImageFile"
import { useCamera } from "ds/hooks/useCamera"
import Konva from "konva"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { RiCameraLine, RiImageAddLine, RiSkipBackFill } from "react-icons/ri"
import { Image, Layer, Stage } from "react-konva"
import Typist from "react-typist"
import Webcam from "react-webcam"
import useCanvasImage from "use-image"

import convertFace from "../queries/convertFace"
import detectFace from "../queries/detectFace"

interface PhotoBoothProps extends StackProps {
  size?: number
  next?: (data: any) => void
}

export const PhotoBooth: React.FC<PhotoBoothProps> = ({ size = 256, next, ...props }) => {
  const [image, setImage] = useState("")
  const { ref: webcamRef, capture, setCameraError, setCameraOnline } = useCamera(setImage)
  const { FileInput, selectFile } = useBase64ImageFile(setImage)

  const [canvasClouds] = useCanvasImage("/eden-dao-orb.png")
  const [canvasImage] = useCanvasImage(image)

  const [state, setState] = useState<
    "ready" | "selected" | "detecting" | "converting" | "complete"
  >("ready")

  useEffect(() => {
    if (state === "ready" && image.length > 0) {
      setState("selected")
    }
  }, [state, image])

  const stage = useRef<Konva.Stage>(null)

  const processFace = useCallback(async () => {
    const image = stage.current!.toDataURL()

    setState("detecting")
    const header = "data:image/gif;base64,"

    try {
      const {
        data: { image: croppedFace },
      } = await invoke(detectFace, image.slice(image.indexOf(",") + 1))
      setImage(`${header}${croppedFace}`)
      setState("converting")

      const {
        data: {
          images: [, , { image: pixelFace }],
        },
      } = await invoke(convertFace, croppedFace)
      setImage(`${header}${pixelFace}`)
      setState("complete")
    } catch (error) {
      toast.error("NO FACE DETECTED")
      setImage("")
      setState("ready")
    }
  }, [setImage, setState])

  const canvasImageProps = useMemo(() => {
    if (!canvasImage) return {}

    const { naturalHeight, naturalWidth } = canvasImage

    let opacity = 1
    let x = 0
    let y = 0
    let height = size
    let width = (size * naturalWidth) / naturalHeight

    if (state === "detecting" || state === "converting") {
      opacity = 0.7
    }
    if (state === "complete") {
      height *= 0.85
      width *= 0.85
      y = 0.15 * size
    }
    x = width < size ? (size - width) / 2 : 0

    return { opacity, height, width, x, y }
  }, [state, size, canvasImage])

  return (
    <VStack alignItems="stretch" spacing={3} w={size}>
      <Box w={size} h={size} borderRadius="full" overflow="hidden">
        {image && (
          <Stage width={size} height={size} ref={stage}>
            {state === "selected" ? (
              <Layer imageSmoothingEnabled={false}>
                <Image image={canvasImage} alt="face" {...canvasImageProps} />
              </Layer>
            ) : (
              <Layer
                imageSmoothingEnabled={false}
                clipFunc={(ctx) => {
                  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, false)
                }}
              >
                <Image image={canvasClouds} alt="dream" height={size} width={size} />
                <Image image={canvasImage} alt="face" {...canvasImageProps} />
              </Layer>
            )}
          </Stage>
        )}
        <Box pos="relative" float="left">
          <Webcam
            style={{ display: image ? "none" : "block" }}
            mirrored
            height={size}
            width={size}
            videoConstraints={{ facingMode: "user", width: size, height: size }}
            ref={webcamRef}
            screenshotQuality={1}
            screenshotFormat="image/png"
            onUserMedia={() => setCameraOnline(true)}
            onUserMediaError={() => setCameraError(true)}
          />
        </Box>
      </Box>
      {state === "ready" ? (
        <HStack>
          <IconButton
            py={4}
            size="xl"
            variant="outline"
            borderRadius="full"
            fontSize="2rem"
            color="purple.500"
            borderColor="purple.200"
            onClick={selectFile}
            aria-label="Upload Photo"
            icon={
              <>
                <RiImageAddLine />
                <FileInput />
              </>
            }
          />
          <IconButton
            flex={1}
            p={4}
            size="xl"
            color="white"
            variant="solid"
            colorScheme="purple"
            borderRadius="full"
            fontSize="2rem"
            onClick={capture}
            aria-label="Take Photo"
            icon={<RiCameraLine />}
          />
        </HStack>
      ) : state === "selected" ? (
        <HStack>
          <IconButton
            py={4}
            size="xl"
            borderRadius="full"
            fontSize="2rem"
            variant="outline"
            color="purple.500"
            borderColor="purple.200"
            onClick={() => {
              setState("ready")
              setImage("")
            }}
            aria-label="GO BACK"
            icon={<RiSkipBackFill />}
          />
          <Button
            p={4}
            flex={1}
            size="xl"
            color="white"
            colorScheme="purple"
            borderRadius="full"
            onClick={processFace}
          >
            ANONYMIZE
          </Button>
        </HStack>
      ) : state !== "complete" ? (
        <Box py={2}>
          <Progress
            hasStripe
            isAnimated
            size="lg"
            h={10}
            colorScheme="purple"
            value={state === "detecting" ? 25 : 65}
            max={100}
          />
        </Box>
      ) : (
        <HStack>
          <IconButton
            py={4}
            size="xl"
            borderRadius="full"
            fontSize="2rem"
            variant="outline"
            color="purple.400"
            borderColor="purple.400"
            onClick={() => {
              setState("ready")
              setImage("")
            }}
            aria-label="GO BACK"
            icon={<RiSkipBackFill />}
          />
          <Text fontWeight="bold" color="purple.400" p={2}>
            save image w/ right-click (or tap and hold)
          </Text>
          {/* <Button
            p={4}
            flex={1}
            size="xl"
            color="white"
            colorScheme="purple"
            borderRadius="full"
            onClick={() =>
              next?.({
                image: stage.current?.toDataURL({
                  quality: 100,
                  imageSmoothingEnabled: false,
                } as any),
              })
            }
          >
            NEXT
          </Button> */}
        </HStack>
      )}
    </VStack>
  )
}

export default PhotoBooth
