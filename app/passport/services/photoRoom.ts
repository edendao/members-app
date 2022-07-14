export const removeBackground = async (image: string) => {
  const form = new FormData()
  form.append("image_file", await fetch(image).then((r) => r.blob()))
  form.append("size", "medium")

  const r = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: {
      "x-api-key": "b87a62daa3e3bde340691a903a10e40f5def4ca3",
    },
    body: form,
  })

  if (r.status !== 200) {
    throw new Error(await r.text())
  }

  return URL.createObjectURL(await r.blob())
}
