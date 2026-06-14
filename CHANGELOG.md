# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - 2026-06-14

### Changed
- Removed invalid `exports` configuration (non-existent index.js)
- Fixed `author` field to match npm username (traz1r)
- Simplified README to focus on npm scripts usage
- Updated all command references to use npm scripts instead of global CLI

### Removed
- Global bin commands (npm auto-removal due to validation issues)

### Documentation
- Added CHANGELOG.md for version tracking

## [1.0.3] - 2026-06-14

### Added
- Created `bin/` directory with executable wrapper scripts
- Added bin files: wfslide-language, wfslide-style, wfslide-class, wfslide-research, wfslide-artifact, wfslide-export

### Fixed
- Attempted to fix npm bin configuration with proper directory structure

## [1.0.2] - 2026-06-14

### Added
- Executable permissions to all `.mjs` scripts (`chmod +x`)

### Fixed
- Git tracking of executable file permissions

## [1.0.1] - 2026-06-14

### Changed
- Simplified CLI command names from `wonderful-slide-*` to `wsl-*` format

### Added
- Package.json files field configuration for npm publishing

## [1.0.0] - 2026-06-14

### Added
- Initial release of `@traz1r/wonderful-slide`
- AI Native Slidev deck workflow skill
- Quality check scripts:
  - `language-check.mjs` - Scan for defensive phrasing and technical pileup
  - `style-line-report.mjs` - Report CSS and Vue scoped-style line counts
  - `class-usage-scan.mjs` - Find unused CSS classes
  - `research-audit.mjs` - Verify research integrity in `index.md`
  - `artifact-scan.mjs` - Detect prompt artifacts and planning language
  - `export-check.mjs` - Export slides to PNG and check for errors
- Reference documentation for the workflow
- OpenAI agent configuration for Claude Code
- MIT License