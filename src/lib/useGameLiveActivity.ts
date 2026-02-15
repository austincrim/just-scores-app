import { useCallback, useEffect, useRef, useState } from "react"
import { endActivity } from "../../modules/live-activity-module"
import { Game } from "@/types"
import { startGameLiveActivity, updateGameLiveActivity } from "./live-activity"
import { storage } from "./storage"

const ACTIVITIES_STORAGE_KEY = "live_activities"

type ActivityMap = Record<string, string>

function getStoredActivities(): ActivityMap {
  const json = storage.getString(ACTIVITIES_STORAGE_KEY)
  return json ? JSON.parse(json) : {}
}

function storeActivity(gameId: string, activityId: string) {
  const activities = getStoredActivities()
  activities[gameId] = activityId
  storage.set(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities))
}

function removeStoredActivity(gameId: string) {
  const activities = getStoredActivities()
  delete activities[gameId]
  storage.set(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities))
}

export function useGameLiveActivity(game: Game | undefined) {
  const activityIdRef = useRef<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const gameId = game ? String(game.id) : null

  const resetTracking = useCallback(() => {
    if (gameId) removeStoredActivity(gameId)
    activityIdRef.current = null
    setIsTracking(false)
  }, [gameId])

  const safeUpdate = useCallback(
    (activityId: string, gameData: Game) => {
      const success = updateGameLiveActivity(activityId, gameData)
      if (!success) {
        resetTracking()
      }
      return success
    },
    [resetTracking],
  )

  useEffect(() => {
    if (!game || !gameId) return

    const storedActivityId = getStoredActivities()[gameId]
    if (storedActivityId) {
      const success = updateGameLiveActivity(storedActivityId, game)
      if (success) {
        activityIdRef.current = storedActivityId
        setIsTracking(true)
      } else {
        removeStoredActivity(gameId)
      }
    }
  }, [gameId])

  const awayScore = game?.box_score?.score?.away?.score
  const homeScore = game?.box_score?.score?.home?.score
  const progressString = game?.box_score?.progress?.string

  useEffect(() => {
    if (!game || !activityIdRef.current) return
    if (game.status !== "in_progress") return

    updateGameLiveActivity(activityIdRef.current, game)
  }, [game?.status, awayScore, homeScore, progressString])

  useEffect(() => {
    if (!game) return
    if (game.status === "final" && activityIdRef.current) {
      safeUpdate(activityIdRef.current, game)
      resetTracking()
    }
  }, [game, game?.status, safeUpdate, resetTracking])

  const startTracking = useCallback(async () => {
    if (!game || !gameId) return
    if (activityIdRef.current) return

    try {
      const activityId = startGameLiveActivity(game)
      activityIdRef.current = activityId
      setIsTracking(true)
      storeActivity(gameId, activityId)
    } catch (error) {
      console.error("Failed to start Live Activity:", error)
    }
  }, [game, gameId])

  const stopTracking = useCallback(async () => {
    if (activityIdRef.current) {
      try {
        await endActivity(activityIdRef.current)
      } catch (error) {
        console.error("Failed to end Live Activity:", error)
      }
    }
    resetTracking()
  }, [resetTracking])

  return {
    isTracking,
    startTracking,
    stopTracking,
  }
}
