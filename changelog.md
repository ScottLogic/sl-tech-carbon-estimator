# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added


### Changed


### Fixed


### Deprecated


### Removed


### Security


---

## [0.5.0] - 2025-11-06
### Added
- `#138 Add compatability with schema v0.0.2`
- `#139 Add ability to display the CO2 values as well as percentages`
- `#140 Add export as JSON and PDF`
- `#182 Add wrapper around CO2 library`
- `#179 Add tests to cover invalid input`
- `#210 Add GitHub workflows for updating Playwright screenshots`
- `#240 #242 Add compatability with schema v0.1.0`
- `#199 Add to test suite accessibility automation for expansion/dropdown options`
- `#206 Add to test suite automation to handle Kg scenarios`
- `#205 Add new Linux snapshots to cover Kg`
- `#171 Add automate package versioning using semantic-release`
- `#149 Add Develop branch protection`
- `#215 Add Test suite POM conversion`
- `#144 Add screenshot comparison to e2e tests`
- `#219 Add styling isolation via Shadow DOM`
- `#237 Add monthly view for emission figures`

### Changed
- <!-- Add changes to existing functionality here. Example: `- Switch build to Vite` -->
- `#220 Switch Downstream Emissions calculation into a class`
- `#175 Switch optimise tests by moving repeated assertions into helper methods/files`
- `#142 Switch update Playwright framework to use the Node.js version`
- `#255 Switch update Playwright file structure`

### Fixed
- <!-- Add bug fixes. Example: `- Fix some buggy deficient thing` -->
- `#232 Fix Incorrect background colour of export menu in lightmode`
- `#204 Fix Table contrast for totals is insufficient`
- `#231 Fix On-hover for quadrants legend has contrast issues when in darkmode`
- `#208 Fix Diagram view disappears on screen resize`
- `#183 Fix contrast for links is not suitable ratio in darkmode`
- `#180 Fix colour contrast for expansion panels is not suitabe ratio in darkmode`
- `#173 Fix Darkmode causes poor contrast in table view`
- `#148 Fix broken Playwright framework`
- `#198 Fix Dropdowmn contrast is insufficient in darkmode`
- `#251 Fix tooltip and assumption statement`

### Deprecated
- <!-- Add items that are deprecated and will be removed in a future release. -->

### Removed
- `#181 Removed unused imports`

### Security
- `#190 Add GitHub Code Analysis`
- `#141 Review dependencies, vulnerabilities and additional security`

---

### How to use
- Update the **Unreleased** section during development.
- When cutting a release:
  1. Copy the Unreleased contents into a new release heading `[MAJOR.MINOR.PATCH] - YYYY-MM-DD`.
  2. Update version and date.
  3. Keep Unreleased empty for future changes.

### Notes
- Keep entries concise and use one line per change.
- Prefer semantic commit messages to help populate these entries.