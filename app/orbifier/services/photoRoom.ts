export const removeBackground = async (
  image: string,
  apiKey = "b87a62daa3e3bde340691a903a10e40f5def4ca3"
) => {
  const body = new FormData()
  body.append("size", "medium")

  const imageFile = await fetch(image).then((r) => r.blob())
  body.append("image_file", imageFile)

  const r = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: { "x-api-key": apiKey },
    body,
  })

  if (!r.ok || r.status !== 200) {
    throw new Error(await r.text())
  }

  return new Promise<string>(async (resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target!.result as string)
    reader.onerror = reject
    reader.readAsDataURL(await r.blob())
  })
}
