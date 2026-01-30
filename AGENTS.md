# Agent Guidelines

## Build & Development Commands

- **Start dev server**: `pnpm start` (Expo)
- **Type check**: `pnpm check` (tsc --noEmit)

## Architecture

**Expo/React Native mobile app** for sports scores across NFL, NCAAF, NCAAB.

- **API**: TheScore API (api.thescore.com) - see `API.md` for endpoints
- **State**: React Query 5 with persistent cache (1-week GC), stored via react-native-mmkv
- **Navigation**: React Navigation native-stack + bottom-tabs
- **UI**: NativeWind (Tailwind + React Native)

**Folder structure**:
- `src/components/` - Reusable UI components (scores, box scores, team lines)
- `src/screens/` - Tab screens (sport-specific views) + GameDetails, TeamDetail
- `src/lib/` - Custom hooks (useSchedule, useGames, useTeamStanding, etc.), storage
- `src/types.ts` - Comprehensive TypeScript types for all API responses

**Key types**: Game (NFLEvent | NcaaFBEvent | NcaaBBEvent), BoxScore (Football | Basketball), PlayerRecord

## Code Style

- **Language**: TypeScript (strict: true)
- **Imports**: React → React Native → Expo → third-party → @/ (src alias) → relative
- **Formatting**: Prettier (semi: false, 2-space). Plugin: @ianvs/prettier-plugin-sort-imports
- **Naming**: camelCase variables/functions, PascalCase components, SCREAMING_SNAKE_CASE constants
- **Styling**: TailwindCSS classes via nativewind
- **Error handling**: Fetch errors logged via console.error, graceful fallbacks (return [] or null)
- **Types**: Exhaustive type definitions in types.ts; union types for multi-sport (Game, BoxScore, PlayerRecord)
- Attempt to fetch a little data as possible from the API using filtering, sorting, specific endpoint. Fetching large amounts of events can cause UI lag.
- Ensure all UI changes work in light/dark mode
