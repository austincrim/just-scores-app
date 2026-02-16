#!/usr/bin/env node

/**
 * Syncs the widget extension's CURRENT_PROJECT_VERSION with the main app's
 * CFBundleVersion from Info.plist.
 *
 * eas/configure_ios_version writes the build number to Info.plist files, but
 * the widget uses GENERATE_INFOPLIST_FILE=YES which derives CFBundleVersion
 * from CURRENT_PROJECT_VERSION in the pbxproj. This script reads the version
 * from the main app's Info.plist and writes it to the widget's
 * CURRENT_PROJECT_VERSION in the pbxproj.
 */

const fs = require("fs")
const path = require("path")

const iosDir = path.join(__dirname, "..", "ios")
const plistPath = path.join(iosDir, "justscores", "Info.plist")
const pbxprojPath = path.join(
  iosDir,
  "justscores.xcodeproj",
  "project.pbxproj"
)

if (!fs.existsSync(plistPath) || !fs.existsSync(pbxprojPath)) {
  console.log("Required files not found, skipping widget version sync")
  process.exit(0)
}

// Read CFBundleVersion from main app's Info.plist
const plistContents = fs.readFileSync(plistPath, "utf8")
const versionMatch = plistContents.match(
  /<key>CFBundleVersion<\/key>\s*<string>([^<]+)<\/string>/
)

if (!versionMatch) {
  console.log("Could not find CFBundleVersion in main app Info.plist")
  process.exit(0)
}

const buildNumber = versionMatch[1]
console.log(`Main app CFBundleVersion from Info.plist: ${buildNumber}`)

if (buildNumber === "1") {
  console.log("Version is 1, no sync needed")
  process.exit(0)
}

// Update CURRENT_PROJECT_VERSION for ExpoWidgetsTarget in pbxproj
let pbxproj = fs.readFileSync(pbxprojPath, "utf8")

const configRegex =
  /([A-F0-9]{24})\s*\/\*\s*(Debug|Release)\s*\*\/\s*=\s*\{[^}]*buildSettings\s*=\s*\{([^}]+)\}/g

let modified = false
let match
while ((match = configRegex.exec(pbxproj)) !== null) {
  const settings = match[3]
  if (settings.includes("ExpoWidgetsTarget")) {
    const versionMatch = settings.match(
      /CURRENT_PROJECT_VERSION\s*=\s*([^;]+);/
    )
    if (versionMatch && versionMatch[1].trim() !== buildNumber) {
      console.log(
        `Updating widget ${match[2]} CURRENT_PROJECT_VERSION from ${versionMatch[1].trim()} to ${buildNumber}`
      )
      const oldSection = match[0]
      const newSection = oldSection.replace(
        /CURRENT_PROJECT_VERSION\s*=\s*[^;]+;/,
        `CURRENT_PROJECT_VERSION = ${buildNumber};`
      )
      pbxproj = pbxproj.replace(oldSection, newSection)
      modified = true
    }
  }
}

if (modified) {
  fs.writeFileSync(pbxprojPath, pbxproj, "utf8")
  console.log("Widget CURRENT_PROJECT_VERSION synced successfully")
} else {
  console.log("No widget configs needed updating")
}
