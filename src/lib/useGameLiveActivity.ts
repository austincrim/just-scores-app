import { useCallback, useEffect, useRef, useState } from "react"
import { Game } from "@/types"
import { startGameLiveActivity, updateGameLiveActivity } from "./live-activity"
import { storage } from "./storage"

const ACTIVITY_STORAGE_KEY = "live_activity_id"
const ACTIVITY_GAME_ID_KEY = "live_activity_game_id"

function clearStoredActivity() {
  storage.remove(ACTIVITY_STORAGE_KEY)
  storage.remove(ACTIVITY_GAME_ID_KEY)
}

export function useGameLiveActivity(game: Game | undefined) {
  const activityIdRef = useRef<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  const resetTracking = useCallback(() => {
    clearStoredActivity()
    activityIdRef.current = null
    setIsTracking(false)
  }, [])

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
    const storedActivityId = storage.getString(ACTIVITY_STORAGE_KEY)
    const storedGameId = storage.getString(ACTIVITY_GAME_ID_KEY)

    if (
      storedActivityId &&
      storedGameId &&
      game &&
      storedGameId === String(game.id)
    ) {
      const success = updateGameLiveActivity(storedActivityId, game)
      if (success) {
        activityIdRef.current = storedActivityId
        setIsTracking(true)
      } else {
        clearStoredActivity()
      }
    } else if (storedActivityId && game && storedGameId !== String(game.id)) {
      clearStoredActivity()
    }
  }, [game?.id])

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

  const startTracking = useCallback(() => {
    if (!game) return
    if (activityIdRef.current) return

    try {
      const activityId = startGameLiveActivity(game)
      activityIdRef.current = activityId
      setIsTracking(true)
      storage.set(ACTIVITY_STORAGE_KEY, activityId)
      storage.set(ACTIVITY_GAME_ID_KEY, String(game.id))
    } catch (error) {
      console.error("Failed to start Live Activity:", error)
    }
  }, [game])

  const stopTracking = useCallback(() => {
    if (activityIdRef.current && game) {
      safeUpdate(activityIdRef.current, game)
    }
    resetTracking()
  }, [game, safeUpdate, resetTracking])

  return {
    isTracking,
    startTracking,
    stopTracking,
  }
}
