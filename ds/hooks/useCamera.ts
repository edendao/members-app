import { useCallback, useRef, useState } from "react"
import Webcam from "react-webcam"

export const useCamera = (setImage: {
  (value: React.SetStateAction<string>): void
  (arg0: string): void
}) => {
  const [isCameraOnline, setCameraOnline] = useState(false)
  const [isCameraError, setCameraError] = useState(false)

  const ref = useRef<Webcam>(null)
  const capture = useCallback(() => {
    setImage(ref.current?.getScreenshot() ?? "")
  }, [ref, setImage])

  return {
    ref,
    capture,
    isCameraError,
    isCameraOnline,
    setCameraOnline,
    setCameraError,
  }
}
