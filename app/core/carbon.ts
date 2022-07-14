import groupBy from "lodash/groupBy"

// 1 tCO2 = 1,000,000 gCO2
export const gCO2toTCO2 = (gCO2: number) => gCO2 / 1_000_000

// 1 tCO2 = 310.16 ton-years over a time horizon of 1,000 years
// https://carbonplan.org/research/ton-year-explainer
export const co2toTonYears = (n: number) => n * 310.16

export const tonYearsToCO2 = (tonYears: number) => tonYears / 310.16

export const gCO2toTonYears = (gCO2: number) => gCO2toTCO2(co2toTonYears(gCO2))

// tCO2 = mtCO2 = millenium ton of CO2 = 1000-year ton of CO2
// price estimate = 500-3000 dollars per mtCO2
export const usdtotCO2 = (usd: number) => [usd / 3000, usd / 500] as const

export const tCO2toUSD = (tCO2: number) => [tCO2 * 500, tCO2 * 3000] as const

export const tonYearsToUSD = (tonYears: number) =>
  [(tonYears / 1000) * 200, (tonYears / 1000) * 3000] as const

// Date of Removal, tCO2e, Permanence in Years
export type Removal = [Date, number, number]

export const removalsToTonYears = (years: number[], removals: Removal[]) => {
  const tonYears = new Array(years.length).map(() => 0)
  const removalsByYear = groupBy(removals, ([date]) => date.getUTCFullYear())

  for (let cursor = 0; cursor < years.length; ++cursor) {
    const year = years[cursor] as number
    const removals = removalsByYear[year] ?? []

    for (const [, tCO2, permanence] of removals) {
      for (let offset = 0; offset < permanence && cursor + offset < years.length; ++offset) {
        tonYears[cursor + offset] += tCO2
      }
    }
  }

  return tonYears
}
