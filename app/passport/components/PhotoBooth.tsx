/* eslint-disable no-debugger */
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  StackProps,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { invoke } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import { useBase64ImageFile } from "ds/hooks/useBase64ImageFile"
import { useCamera } from "ds/hooks/useCamera"
import Konva from "konva"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { GiFairyWand, GiSteampunkGoggles } from "react-icons/gi"
import { RiCameraLine, RiImageAddLine, RiSkipBackFill } from "react-icons/ri"
import { Image, Layer, Stage } from "react-konva"
import Webcam from "react-webcam"
import { useTrack } from "use-analytics"
import useCanvasImage from "use-image"

import convertFace from "../queries/convertFace"
import detectFace from "../queries/detectFace"
import { removeBackground } from "../services/photoRoom"

interface PhotoBoothProps extends StackProps {
  size?: number
  next?: (data: any) => void
}

export const PhotoBooth: React.FC<PhotoBoothProps> = ({ next, ...props }) => {
  const size = useBreakpointValue([256, 384, 512]) ?? 256
  const track = useTrack()

  const [image, setImage] = useState("")
  const { ref: webcamRef, capture, setCameraError, setCameraOnline } = useCamera(setImage)
  const { FileInput, selectFile } = useBase64ImageFile(setImage)

  const [canvasImage] = useCanvasImage(image)
  const [canvasSkyOrb] = useCanvasImage("/eden-dao-orb.png")
  const [canvasOrb] = useCanvasImage("/refi-orb.png")
  const [canvasBackground, setCanvasBackground] = useState<HTMLImageElement>()

  useEffect(() => {
    if (canvasSkyOrb) {
      setCanvasBackground(canvasSkyOrb)
    }
  }, [canvasSkyOrb, setCanvasBackground])

  type State = "ready" | "selected" | "detecting" | "converting" | "complete"
  const [state, setState] = useState<State>("ready")
  const setStateTo = useCallback(
    (s: State) => {
      track(s)
      setState(s)
    },
    [track, setState]
  )

  useEffect(() => {
    if (state === "ready" && image.length > 0) {
      setStateTo("selected")
    }
  }, [state, image, setStateTo])

  const stage = useRef<Konva.Stage>(null)

  const isolateFace = useCallback(async () => {
    try {
      const image = stage.current!.toDataURL()
      setStateTo("detecting")
      setImage(await removeBackground(image))
      setStateTo("complete")
    } catch (error) {
      toast.error(error.message)
      setImage("")
      setStateTo("ready")
    }
  }, [setImage, setStateTo])

  const processFace = useCallback(async () => {
    try {
      setStateTo("detecting")

      const image = stage.current!.toDataURL()
      const header = "data:image/gif;base64,"
      const {
        data: { image: croppedFace },
      } = await invoke(detectFace, image.slice(image.indexOf(",") + 1))
      setImage(`${header}${croppedFace}`)
      setStateTo("converting")

      const {
        data: {
          images: [, , { image: pixelFace }],
        },
      } = await invoke(convertFace, croppedFace)
      setImage(`${header}${pixelFace}`)
      setStateTo("complete")
    } catch (error) {
      toast.error("NO FACE DETECTED")
      setImage("")
      setStateTo("ready")
    }
  }, [setImage, setStateTo])

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
    <VStack alignItems="center" spacing={8} {...props}>
      <Shimmer position="relative" top={4}>
        orbifier 9000
      </Shimmer>
      <Box
        borderRadius="full"
        overflow="hidden"
        animation={
          state === "detecting" || state === "converting"
            ? "floater 0.5s ease-in-out infinite alternate"
            : state === "complete"
            ? "pulser-cw 2.5s ease-in-out infinite alternate"
            : ""
        }
      >
        {image ? (
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
                <Image image={canvasBackground} alt="dream" height={size} width={size} />
                <Image image={canvasImage} alt="face" {...canvasImageProps} />
              </Layer>
            )}
          </Stage>
        ) : (
          <Webcam
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
        )}
      </Box>
      {state === "ready" ? (
        <HStack>
          <Button
            size="xl"
            variant="outline"
            borderRadius="full"
            color="purple.500"
            borderColor="purple.200"
            onClick={() => {
              track("PhotoBooth.upload")
              selectFile()
            }}
            aria-label="Upload Photo"
            leftIcon={<RiImageAddLine size={32} />}
          >
            Upload
            <FileInput />
          </Button>
          <Button
            flex={1}
            size="xl"
            color="white"
            variant="solid"
            colorScheme="purple"
            borderRadius="full"
            onClick={() => {
              track("PhotoBooth.capture")
              capture()
            }}
            aria-label="Take Photo"
            rightIcon={<RiCameraLine size={32} />}
          >
            Snap
          </Button>
        </HStack>
      ) : state === "selected" ? (
        <HStack>
          <IconButton
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
            size="xl"
            colorScheme="purple"
            borderRadius="full"
            onClick={() => {
              track("PhotoBooth.isolate")
              isolateFace()
            }}
            rightIcon={<GiFairyWand size={21} />}
          >
            REMOVE BG
          </Button>
          <Button
            size="xl"
            color="white"
            colorScheme="purple"
            borderRadius="full"
            onClick={() => {
              track("PhotoBooth.process")
              processFace()
            }}
            rightIcon={<GiSteampunkGoggles size={26} />}
          >
            PUNKIFY
          </Button>
        </HStack>
      ) : state !== "complete" ? null : (
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
              setStateTo("ready")
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
      {state !== "ready" && state !== "selected" && (
        <ButtonGroup size="lg" spacing={4}>
          <Button
            colorScheme={canvasBackground === canvasOrb ? "purple" : "gray"}
            rounded="full"
            onClick={() => {
              track("PhotoBooth.background.refi")
              setCanvasBackground(canvasOrb)
            }}
          >
            refipunk
          </Button>
          <Button
            colorScheme={canvasBackground === canvasSkyOrb ? "purple" : "gray"}
            rounded="full"
            onClick={() => {
              track("PhotoBooth.background.sky")
              setCanvasBackground(canvasSkyOrb)
            }}
          >
            edenpunk
          </Button>
        </ButtonGroup>
      )}
    </VStack>
  )
}

export default PhotoBooth
