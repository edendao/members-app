/* eslint-disable no-debugger */
import {
  Box,
  Button,
  HStack,
  IconButton,
  Link,
  StackProps,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { Image as BlitzImage, invoke } from "blitz"
import { Shimmer } from "ds/atoms/Shimmer"
import { useBase64ImageFile } from "ds/hooks/useBase64ImageFile"
import { useCamera } from "ds/hooks/useCamera"
import Konva from "konva"
import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { GiFairyWand } from "react-icons/gi"
import { RiCameraLine, RiImageAddLine, RiSkipBackFill } from "react-icons/ri"
import { Image, KonvaNodeComponent, Layer, Stage } from "react-konva"
import Webcam from "react-webcam"
import useCanvasImage from "use-image"
import { saveAs } from "file-saver"

import convertFace from "./queries/convertFace"
import detectFace from "./queries/detectFace"
import { removeBackground } from "./services/photoRoom"
import { Node } from "konva/lib/Node"

interface PhotoBoothProps extends StackProps {
  size?: number
  next?: (data: any) => void
}

export const PhotoBooth: React.FC<PhotoBoothProps> = ({ next, ...props }) => {
  const size = useBreakpointValue([200, 200, 300]) ?? 256

  const [image, setImage] = useState("")
  const { ref: webcamRef, capture, setCameraError, setCameraOnline } = useCamera(setImage)
  const { FileInput, selectFile } = useBase64ImageFile(setImage)

  const [canvasImage] = useCanvasImage(image)
  type Tribe = "refi" | "solar" | "aqua" | "earth" | "flora"
  const [tribe, setTribe] = useState<Tribe>("refi")
  const [canvasBackground] = useCanvasImage(`/orbs/${tribe}.png`)

  type State = "ready" | "selected" | "detecting" | "converting" | "complete"
  const [state, setState] = useState<State>("ready")
  const setStateTo = useCallback(
    (s: State) => {
      setState(s)
    },
    [setState]
  )

  useEffect(() => {
    if (state === "ready" && image.length > 0) {
      setStateTo("selected")
    }
  }, [state, image, setStateTo])

  const stage = useRef<Konva.Stage>(null)

  const [isPunk, setPunked] = useState(false)

  const resetState = useCallback(
    () =>
      startTransition(() => {
        setImage("")
        setPunked(false)
        setState("ready")
      }),
    [setState, setImage, setPunked]
  )

  const downloadImage = () => {
    const img = orbRef.current
      ? (orbRef.current as Node).toImage({
          mimeType: "img/png",
          callback: (orbImage) => {
            saveAs(orbImage?.src, "ImOrbified.png") // Put your image url here.
          },
        })
      : ""
  }

  const removeBG = useCallback(async () => {
    try {
      toast.loading(
        <Link href="https://www.photoroom.com/" target="_blank" isExternal>
          <BlitzImage src="/attributions/photo-room.svg" height={60} width={177} />
        </Link>,
        {
          duration: 0,
          position: "bottom-right",
        }
      )

      setStateTo("detecting")
      setImage(await removeBackground(stage.current!.toDataURL()))
      setStateTo("complete")
    } catch (error) {
      toast.error(error.message)
      resetState()
    }
  }, [setImage, setStateTo, resetState])

  const punkify = useCallback(async () => {
    try {
      toast.loading(
        <Text>
          Powered by
          <br />
          <Link href="https://pixel-me.tokyo/en/" target="_blank">
            <BlitzImage src="/attributions/pixel-me.png" height={128} width={159} />
          </Link>
        </Text>,
        {
          duration: 3000,
          position: "bottom-right",
        }
      )

      setStateTo("detecting")
      const face = await invoke(detectFace, stage.current!.toDataURL())
      setImage(face)

      setStateTo("converting")
      const punk = await invoke(convertFace, face)
      setImage(punk)

      setPunked(true)
      setStateTo("complete")
    } catch (error) {
      toast.error("NO FACE DETECTED")
      resetState()
    }
  }, [setImage, setStateTo, resetState])

  const canvasImageProps = useMemo(() => {
    if (!canvasImage) return {}

    const { naturalHeight, naturalWidth } = canvasImage

    let opacity = 1
    let height = size
    let width = (size * naturalWidth) / naturalHeight
    let x = 0
    let y = 0
    let rotation = 0

    if (state === "detecting" || state === "converting") {
      opacity = 0.7
    }

    if (state === "complete") {
      y += 48
      x += 12
      height *= 0.85
      width *= 0.85
      rotation = -12
    }

    y += size - height
    x += width < size ? (size - width) / 2 : 0

    return { opacity, height, width, x, y, rotation }
  }, [state, size, canvasImage])

  const orbRef = useRef(null)

  return (
    <VStack alignItems="center" spacing={8} {...props}>
      <Shimmer position="relative" fontSize="40" top={4}>
        Get Your ReFi Orb!
      </Shimmer>
      <Box
        borderRadius="full"
        overflow="hidden"
        animation={
          state === "detecting" || state === "converting"
            ? "floater 0.5s ease-in-out infinite alternate"
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
                ref={orbRef}
              >
                <Image image={canvasBackground} alt="dream" height={size} width={size} />
                <Image
                  image={canvasImage}
                  alt="face"
                  shadowBlur={32}
                  shadowOffsetY={4}
                  shadowOpacity={0.8}
                  shadowColor="#efefd8"
                  {...canvasImageProps}
                />
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
              removeBG()
            }}
            rightIcon={<GiFairyWand size={21} />}
          >
            Orbifi!
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
            onClick={resetState}
            aria-label="GO BACK"
            icon={<RiSkipBackFill />}
          />
          <Button
            flex={1}
            size="xl"
            color="white"
            variant="solid"
            colorScheme="purple"
            borderRadius="full"
            onClick={() => {
              downloadImage()
            }}
          >
            Save
          </Button>
        </HStack>
      )}
    </VStack>
  )
}

export default PhotoBooth
