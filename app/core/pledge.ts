export const url = process.env.BLITZ_PUBLIC_PLEDGE_URL!

export const open = () => {
  window.open(url, "_blank")
}
