// 1 tCO2 = 1,000,000 gCO2
export const gCO2toTCO2 = (n: number) => n / 1_000_000

// 1 tCO2 = 310.16 ton-years over a time horizon of 1,000 years
// https://carbonplan.org/research/ton-year-explainer
export const tCO2toTonYears = (n: number) => n * 310.16

export const gCO2toTonYears = (n: number) => gCO2toTCO2(tCO2toTonYears(n))

export const numberToWords = (n: number) =>
  n >= 1e9
    ? (n / 1e9).toFixed(2) + "B"
    : n >= 1e6
    ? (n / 1e6).toFixed(2) + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(2) + "K"
    : n.toFixed(2)
