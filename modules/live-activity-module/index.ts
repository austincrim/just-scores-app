import { NativeModule, requireNativeModule } from "expo"

type LiveActivityModuleEvents = {}

declare class LiveActivityModuleType extends NativeModule<LiveActivityModuleEvents> {
  startActivity: (
    awayTeamAbbr: string,
    homeTeamAbbr: string,
    sport: string,
    awayTeamId: number,
    homeTeamId: number,
    awayScore: number,
    homeScore: number,
    progressString: string,
    deepLink: string,
  ) => Promise<string>
  updateActivity: (
    activityId: string,
    awayScore: number,
    homeScore: number,
    progressString: string,
  ) => Promise<boolean>
  endActivity: (activityId: string) => Promise<boolean>
  cacheTeamLogo: (
    url: string,
    sport: string,
    teamId: number,
  ) => Promise<string | null>
  listActiveActivityIds: () => string[]
}

const LiveActivityModuleNative =
  requireNativeModule<LiveActivityModuleType>("LiveActivityModule")

export function startActivity(
  awayTeamAbbr: string,
  homeTeamAbbr: string,
  sport: string,
  awayTeamId: number,
  homeTeamId: number,
  awayScore: number,
  homeScore: number,
  progressString: string,
  deepLink: string,
): Promise<string> {
  return LiveActivityModuleNative.startActivity(
    awayTeamAbbr,
    homeTeamAbbr,
    sport,
    awayTeamId,
    homeTeamId,
    awayScore,
    homeScore,
    progressString,
    deepLink,
  )
}

export function updateActivity(
  activityId: string,
  awayScore: number,
  homeScore: number,
  progressString: string,
): Promise<boolean> {
  return LiveActivityModuleNative.updateActivity(
    activityId,
    awayScore,
    homeScore,
    progressString,
  )
}

export function endActivity(activityId: string): Promise<boolean> {
  return LiveActivityModuleNative.endActivity(activityId)
}

export function cacheTeamLogo(
  url: string,
  sport: string,
  teamId: number,
): Promise<string | null> {
  return LiveActivityModuleNative.cacheTeamLogo(url, sport, teamId)
}

export function listActiveActivityIds(): string[] {
  return LiveActivityModuleNative.listActiveActivityIds()
}
