import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { createMMKV } from "react-native-mmkv"
import { Team } from "@/types"

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

export function useFavoriteTeams(): [Team[], (teams: Team[]) => void] {
  // This will be replaced with useMMKVObject hook in components
  // Keeping as export for non-hook usage
  const json = storage.getString(FAVORITES_KEY)
  const teams = json ? JSON.parse(json) : []
  const setTeams = (newTeams: Team[]) => {
    storage.set(FAVORITES_KEY, JSON.stringify(newTeams))
  }
  return [teams, setTeams]
}

export function isFavoriteTeamSync(teamId: number): boolean {
  try {
    const json = storage.getString(FAVORITES_KEY)
    const teams: Team[] = json ? JSON.parse(json) : []
    return teams.some((t) => t.id === teamId)
  } catch (e) {
    console.error("Error checking favorite:", e)
    return false
  }
}
