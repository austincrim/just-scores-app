import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useQueries } from "@tanstack/react-query"
import {
  cacheTeamLogo,
  endActivity,
  listActiveActivityIds,
} from "../../modules/live-activity-module"
import { Game } from "@/types"
import { API_URL } from "./hooks"
import {
  extractGameActivityProps,
  startGameLiveActivity,
  updateGameLiveActivity,
} from "./live-activity"
import { storage } from "./storage"

const ACTIVITIES_STORAGE_KEY = "live_activities"

type TrackedGame = {
  gameId: number
  sport: string
  activityId: string
}

type LiveActivityContextValue = {
  trackedGames: TrackedGame[]
  startTracking: (game: Game) => Promise<void>
  stopTracking: (gameId: number) => Promise<void>
  isTrackingGame: (gameId: number) => boolean
}

const LiveActivityContext = createContext<LiveActivityContextValue>({
  trackedGames: [],
  startTracking: async () => {},
  stopTracking: async () => {},
  isTrackingGame: () => false,
})

export function useLiveActivity() {
  return useContext(LiveActivityContext)
}

function getStoredActivities(): TrackedGame[] {
  // Migrate from old single-activity storage format
  const oldActivityId = storage.getString("live_activity_id")
  const oldGameId = storage.getString("live_activity_game_id")
  const oldSport = storage.getString("live_activity_sport")
  if (oldActivityId && oldGameId && oldSport) {
    const migrated: TrackedGame[] = [
      {
        activityId: oldActivityId,
        gameId: Number(oldGameId),
        sport: oldSport,
      },
    ]
    storage.set(ACTIVITIES_STORAGE_KEY, JSON.stringify(migrated))
    storage.remove("live_activity_id")
    storage.remove("live_activity_game_id")
    storage.remove("live_activity_sport")
    return migrated
  }

  const json = storage.getString(ACTIVITIES_STORAGE_KEY)
  if (!json) return []
  try {
    return JSON.parse(json) as TrackedGame[]
  } catch {
    return []
  }
}

function persistActivities(activities: TrackedGame[]) {
  storage.set(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities))
}

export function LiveActivityProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activities, setActivities] =
    useState<TrackedGame[]>(getStoredActivities)

  useEffect(() => {
    persistActivities(activities)
  }, [activities])

  useEffect(() => {
    try {
      const nativeIds = listActiveActivityIds()
      setActivities((curr) => {
        const reconciled = curr.filter((a) => nativeIds.includes(a.activityId))
        return reconciled.length !== curr.length ? reconciled : curr
      })
    } catch (e) {
      console.error("Failed to reconcile live activities:", e)
    }
  }, [])

  useQueries({
    queries: activities.map((tracked) => ({
      queryKey: [
        "live_activity_poll",
        tracked.sport,
        tracked.gameId,
        tracked.activityId,
      ],
      refetchInterval: 5000,
      queryFn: async () => {
        const res = await fetch(
          `${API_URL}/${tracked.sport}/events/${tracked.gameId}`,
        )
        if (!res.ok) return null

        const game = (await res.json()) as Game
        const success = await updateGameLiveActivity(tracked.activityId, game)

        if (!success) {
          setActivities((curr) =>
            curr.filter((a) => a.gameId !== tracked.gameId),
          )
          return null
        }

        if (game.status === "final") {
          try {
            await endActivity(tracked.activityId)
          } catch (e) {
            console.error("Failed to end finished Live Activity:", e)
          }
          setActivities((curr) =>
            curr.filter((a) => a.gameId !== tracked.gameId),
          )
        }

        return game
      },
    })),
  })

  const startTracking = useCallback(async (game: Game) => {
    const props = extractGameActivityProps(game)

    await Promise.allSettled([
      cacheTeamLogo(game.away_team.logos.small, props.sport, game.away_team.id),
      cacheTeamLogo(game.home_team.logos.small, props.sport, game.home_team.id),
    ])

    const activityId = await startGameLiveActivity(game)
    const newTracked: TrackedGame = {
      gameId: game.id,
      sport: props.sport,
      activityId,
    }
    setActivities((curr) =>
      curr.some((a) => a.gameId === game.id) ? curr : [...curr, newTracked],
    )
  }, [])

  const stopTracking = useCallback(async (gameId: number) => {
    setActivities((curr) => {
      const tracked = curr.find((a) => a.gameId === gameId)
      if (tracked) {
        endActivity(tracked.activityId).catch((e) =>
          console.error("Failed to end Live Activity:", e),
        )
      }
      return curr.filter((a) => a.gameId !== gameId)
    })
  }, [])

  const isTrackingGame = useCallback(
    (gameId: number) => activities.some((a) => a.gameId === gameId),
    [activities],
  )

  const value: LiveActivityContextValue = {
    trackedGames: activities,
    startTracking,
    stopTracking,
    isTrackingGame,
  }

  return (
    <LiveActivityContext.Provider value={value}>
      {children}
    </LiveActivityContext.Provider>
  )
}
