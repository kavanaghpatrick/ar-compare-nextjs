# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Testing infrastructure with Jest and React Testing Library (169 tests)
- CI/CD pipeline with GitHub Actions
- `.env.example` file for environment configuration
- CONTRIBUTING.md with development guidelines
- CHANGELOG.md for version tracking
- API documentation in `docs/API.md`
- Comprehensive z-index management system with CSS variables

### Changed
- Consolidated BlogListing components (removed duplicate)
- Moved 26 documentation files to `docs/` directory
- Updated canonical URLs to use metadataBase for proper resolution
- Improved React Hook dependencies in components

### Removed
- 15 test/debug routes from production build
- Unused Framer Motion dependency (~50KB bundle reduction)
- Duplicate Google Fonts CSS import (using Next.js font loader)
- 8 obsolete documentation files
- Legacy CSS files from `styles/legacy/`

### Fixed
- Z-index layering issues (navigation appearing behind content)
- Analytics script memory leak
- Missing React Hook dependencies in AdvancedMarketSearch and PageNavigation
- OG image localhost issue with metadataBase configuration

### Security
- Updated Next.js 15.3.4 → 15.5.9 to fix critical RCE vulnerability (CVE)
- Added input validation to API routes with Zod schemas
- Removed console.log statements from production code

## [0.2.0] - 2025-07-05

### Added
- Z-index management system with CSS variables
- Portal pattern for modals and overlays
- Semantic HTML structure improvements
- Layout stability with explicit image dimensions
- Skeleton loaders for better perceived performance

### Fixed
- Hydration mismatches with isHydrated pattern
- CSS consolidation reducing duplicate styles
- Heading hierarchy for accessibility

## [0.1.0] - 2025-06-28

### Added
- Initial Next.js 15 application setup
- Product comparison functionality
- Blog system with categories
- Market analysis pages
- Search functionality
- Mobile-responsive design

### Technical
- App Router architecture
- TypeScript strict mode
- Tailwind CSS styling
- Radix UI components
- Product data structure

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| Unreleased | - | Testing, docs, medium priority fixes |
| 0.2.0 | 2025-07-05 | Structural fixes, z-index, accessibility |
| 0.1.0 | 2025-06-28 | Initial release |
