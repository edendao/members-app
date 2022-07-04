import { useCallback, useRef } from "react"

export const useBase64ImageFile = (setImage: {
  (value: React.SetStateAction<string>): void
  (arg0: string): void
}) => {
  const ref = useRef<HTMLInputElement>(null)

  const setFile = useCallback(
    (event) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target!.result as string
        setImage(base64)
      }
      reader.readAsDataURL(event.target.files[0])
    },
    [setImage]
  )

  const FileInput = useCallback(
    () => (
      <input
        ref={ref}
        type="file"
        accept="image/*"
        onChange={setFile}
        style={{ display: "none" }}
      />
    ),
    [setFile]
  )

  const selectFile = useCallback(() => {
    ref.current?.click()
  }, [ref])

  return { FileInput, selectFile }
}
