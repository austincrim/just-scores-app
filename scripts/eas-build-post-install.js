#!/usr/bin/env node

/**
 * Syncs the widget extension's CURRENT_PROJECT_VERSION with the main app target.
 *
 * With remote versioning + GENERATE_INFOPLIST_FILE=YES, EAS's configure_ios_version
 * step writes CFBundleVersion to the widget's Info.plist, but the plist value is
 * overridden by CURRENT_PROJECT_VERSION in the pbxproj build settings. This script
 * reads the main app's CURRENT_PROJECT_VERSION and copies it to the widget target.
 */

const fs = require("fs")
const path = require("path")

const pbxprojPath = path.join(
  __dirname,
  "..",
  "ios",
  "justscores.xcodeproj",
  "project.pbxproj"
)

if (!fs.existsSync(pbxprojPath)) {
  console.log("project.pbxproj not found, skipping widget version sync")
  process.exit(0)
}

let contents = fs.readFileSync(pbxprojPath, "utf8")

// Parse all build configuration sections
const configRegex =
  /([A-F0-9]{24})\s*\/\*\s*(Debug|Release)\s*\*\/\s*=\s*\{[^}]*buildSettings\s*=\s*\{([^}]+)\}/g

const configs = []
let match
while ((match = configRegex.exec(contents)) !== null) {
  const name = match[2]
  const settings = match[3]
  const bundleId = settings.match(
    /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*([^;]+);/
  )
  const version = settings.match(/CURRENT_PROJECT_VERSION\s*=\s*([^;]+);/)
  if (bundleId && version) {
    configs.push({
      id: match[1],
      name,
      bundleId: bundleId[1].trim(),
      version: version[1].trim(),
    })
  }
}

// Find the main app version (use Release config)
const mainApp = configs.find(
  (c) =>
    c.bundleId === "com.austincrim.justscores" && c.name === "Release"
)

if (!mainApp) {
  console.log("Could not find main app build config")
  process.exit(0)
}

console.log(`Main app version: ${mainApp.version}`)

// Find widget configs
const widgetConfigs = configs.filter((c) =>
  c.bundleId.includes("ExpoWidgetsTarget")
)

if (widgetConfigs.length === 0) {
  console.log("No widget build configs found")
  process.exit(0)
}

let modified = false
for (const widget of widgetConfigs) {
  if (widget.version !== mainApp.version) {
    console.log(
      `Updating widget ${widget.name} version from ${widget.version} to ${mainApp.version}`
    )
    const sectionRegex = new RegExp(
      `(${widget.id}\\s*/\\*\\s*${widget.name}\\s*\\*/\\s*=\\s*\\{[^}]*CURRENT_PROJECT_VERSION\\s*=\\s*)${widget.version.replace(/"/g, '\\"')}(;)`
    )
    contents = contents.replace(
      sectionRegex,
      `$1${mainApp.version}$2`
    )
    modified = true
  }
}

if (modified) {
  fs.writeFileSync(pbxprojPath, contents, "utf8")
  console.log("Widget version synced successfully")
} else {
  console.log("Widget versions already match main app")
}
