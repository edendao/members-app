import mixpanel from "@analytics/mixpanel/lib/analytics-plugin-mixpanel.browser.cjs"
import simple from "@analytics/simple-analytics/lib/analytics-plugin-simple-analytics.browser.cjs"
import Analytics, { AnalyticsPlugin } from "analytics"

export const tryLoadingAnalytics = () => {
  const plugins: AnalyticsPlugin[] =
    process.env.NODE_ENV === "production"
      ? [simple(), mixpanel({ token: process.env.BLITZ_PUBLIC_MIXPANEL_TOKEN! })]
      : []

  return Analytics({ app: "Eden Dao", plugins })
}
