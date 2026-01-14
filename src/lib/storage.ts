import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { createMMKV } from "react-native-mmkv"
import { FavoriteTeam, Team } from "@/types"

export let storage = createMMKV()

let clientStorage = {
  setItem: (key: string, value: boolean | string | number) => {
    storage.set(key, value)
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return value === undefined ? null : value
  },
  removeItem: (key: string) => {
    storage.remove(key)
  },
}

export let persister = createSyncStoragePersister({
  storage: clientStorage,
})

export const FAVORITES_KEY = "favorites_teams"

/**
 * Detect sport from team's api_uri
 * Fallback: defaults to "nfl" if unable to determine
 */
function detectSportFromUri(
  apiUri: string,
): "nfl" | "ncaab" | "ncaaf" {
  if (apiUri.includes("nfl")) return "nfl"
  if (apiUri.includes("ncaab")) return "ncaab"
  if (apiUri.includes("ncaaf")) return "ncaaf"
  return "nfl" // fallback
}

/**
 * Migrate favorite teams to include sport field
 * One-time patch for teams saved without sport
 */
function migrateFavoriteTeamsToIncludeSport(
  teams: (Team | FavoriteTeam)[],
): FavoriteTeam[] {
  return teams.map((team) => {
    // If sport is already present, return as-is
    if ("sport" in team && team.sport) {
      return team as FavoriteTeam
    }
    // Otherwise, detect from api_uri
    return {
      ...team,
      sport: detectSportFromUri(team.api_uri),
    } as FavoriteTeam
  })
}

export function useFavoriteTeams(): [FavoriteTeam[], (teams: FavoriteTeam[]) => void] {
  // This will be replaced with useMMKVObject hook in components
  // Keeping as export for non-hook usage
  const json = storage.getString(FAVORITES_KEY)
  const rawTeams = json ? JSON.parse(json) : []
  const teams = migrateFavoriteTeamsToIncludeSport(rawTeams)
  const setTeams = (newTeams: FavoriteTeam[]) => {
    storage.set(FAVORITES_KEY, JSON.stringify(newTeams))
  }
  return [teams, setTeams]
}

export function isFavoriteTeamSync(teamId: number): boolean {
  try {
    const json = storage.getString(FAVORITES_KEY)
    const rawTeams: (Team | FavoriteTeam)[] = json ? JSON.parse(json) : []
    const teams = migrateFavoriteTeamsToIncludeSport(rawTeams)
    return teams.some((t) => t.id === teamId)
  } catch (e) {
    console.error("Error checking favorite:", e)
    return false
  }
}
