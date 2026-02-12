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

    return config
  })
}

module.exports = withWidgetOverrides
