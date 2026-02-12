import { useCallback } from "react"
import { Game } from "@/types"
import { useLiveActivity } from "./LiveActivityProvider"

export function useGameLiveActivity(game: Game | undefined) {
  const { isTrackingGame, startTracking, stopTracking } = useLiveActivity()

  const isTracking = !!game && isTrackingGame(game.id)

  const start = useCallback(async () => {
    if (!game) return
    await startTracking(game)
  }, [game, startTracking])

  const stop = useCallback(async () => {
    if (!game) return
    await stopTracking(game.id)
  }, [game, stopTracking])

  return {
    isTracking,
    startTracking: start,
    stopTracking: stop,
  }
}
