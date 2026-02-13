const { withXcodeProject } = require("expo/config-plugins")
const fs = require("fs")
const path = require("path")

function withWidgetOverrides(config) {
  return withXcodeProject(config, (config) => {
    const projectRoot = config.modRequest.projectRoot
    const widgetTargetDir = path.join(
      projectRoot,
      "ios",
      "ExpoWidgetsTarget",
    )
    const overridesDir = path.join(
      projectRoot,
      "plugins",
      "widget-overrides",
    )

    if (!fs.existsSync(widgetTargetDir)) {
      console.warn(
        `[withWidgetOverrides] Widget target directory not found: ${widgetTargetDir}`,
      )
      return config
    }

    const files = ["GameScoreActivity.swift", "index.swift"]

    for (const file of files) {
      const src = path.join(overridesDir, file)
      const dest = path.join(widgetTargetDir, file)

      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest)
      } else {
        console.warn(`[withWidgetOverrides] Source file not found: ${src}`)
      }
    }

    // Sync widget extension version with main app
    const widgetPlist = path.join(widgetTargetDir, "Info.plist")
    if (fs.existsSync(widgetPlist)) {
      let plistContent = fs.readFileSync(widgetPlist, "utf-8")
      const buildNumber = config.ios?.buildNumber || config.version || "1"
      plistContent = plistContent.replace(
        /(<key>CFBundleVersion<\/key>\s*<string>)[^<]*(<\/string>)/,
        `$1${buildNumber}$2`,
      )
      fs.writeFileSync(widgetPlist, plistContent)
    }

    return config
  })
}

module.exports = withWidgetOverrides
