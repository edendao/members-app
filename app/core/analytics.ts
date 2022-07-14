import mixpanel from "@analytics/mixpanel/lib/analytics-plugin-mixpanel.browser.cjs"
import simple from "@analytics/simple-analytics/lib/analytics-plugin-simple-analytics.browser.cjs"
import Tracker from "@openreplay/tracker"
import Analytics, { AnalyticsPlugin } from "analytics"

const openReplay = (projectKey: string): AnalyticsPlugin => {
  let tracker: Tracker
  let isLoaded = false

  return {
    name: "open-replay",
    loaded: () => isLoaded,
    initialize: () => {
      tracker = new Tracker({ projectKey, respectDoNotTrack: true })
      tracker.start().then(() => {
        isLoaded = true
      })
    },
    identify: ({ payload }) => {
      const { userId, traits } = payload
      tracker.setUserID(userId)
      for (const [key, value] of Object.entries(traits)) {
        if (value != null) {
          tracker.setMetadata(key, `${value}`)
        }
      }
    },
  }
}

export const tryLoadingAnalytics = () => {
  const plugins: AnalyticsPlugin[] =
    process.env.NODE_ENV === "production"
      ? [
          simple(),
          openReplay("nTf32KmCc91fGNyWTpM5"),
          mixpanel({ token: process.env.BLITZ_PUBLIC_MIXPANEL_TOKEN! }),
        ]
      : []

  return Analytics({ app: "Eden Dao", plugins })
}
