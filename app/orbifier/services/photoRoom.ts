export const removeBackground = async (
  imageURL: string,
  apiKey: string = "b87a62daa3e3bde340691a903a10e40f5def4ca3"
) => {
  const body = new FormData()
  body.append("size", "medium")

  const image = await fetch(imageURL)
  body.append("image_file", await image.blob())

  const r = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body,
  })

  if (!r.ok || r.status !== 200) {
    throw new Error(await r.text())
  }

  const processedImage = await r.blob()

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target!.result as string)
    reader.onerror = reject
    reader.readAsDataURL(processedImage)
  })
}
