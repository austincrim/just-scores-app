import { NativeModule, requireNativeModule } from "expo"

type LiveActivityModuleEvents = {}

declare class LiveActivityModuleType extends NativeModule<LiveActivityModuleEvents> {
  endActivity: (activityId: string) => Promise<void>
  cacheTeamLogo: (
    url: string,
    sport: string,
    teamId: number,
  ) => Promise<string | null>
}

const LiveActivityModuleNative =
  requireNativeModule<LiveActivityModuleType>("LiveActivityModule")

export function endActivity(activityId: string): Promise<void> {
  return LiveActivityModuleNative.endActivity(activityId)
}

export function cacheTeamLogo(
  url: string,
  sport: string,
  teamId: number,
): Promise<string | null> {
  return LiveActivityModuleNative.cacheTeamLogo(url, sport, teamId)
}
