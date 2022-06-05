import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "POW",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  // Note: we provide webpack above so you should not `require` it
  // Perform customizations to webpack config
  // Important: return the modified config
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   return config
  // },
}
module.exports = config
