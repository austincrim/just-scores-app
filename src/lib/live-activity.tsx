import {
  startActivity,
  updateActivity,
} from "../../modules/live-activity-module"
import { Game } from "@/types"

export function extractGameActivityProps(game: Game) {
  const awayScore = game.box_score?.score?.away?.score ?? 0
  const homeScore = game.box_score?.score?.home?.score ?? 0
  const progressString = game.box_score?.progress?.string ?? ""
  const isFootball =
    game.api_uri.includes("nfl") || game.api_uri.includes("ncaaf")
  const sport = game.api_uri.includes("nfl")
    ? "nfl"
    : game.api_uri.includes("ncaaf")
      ? "ncaaf"
      : "ncaab"

  return {
    awayTeamAbbr: game.away_team.abbreviation,
    awayTeamId: game.away_team.id,
    homeTeamAbbr: game.home_team.abbreviation,
    homeTeamId: game.home_team.id,
    awayScore,
    homeScore,
    progressString,
    isFootball,
    sport,
  }
}

export async function startGameLiveActivity(game: Game): Promise<string> {
  const props = extractGameActivityProps(game)
  const deepLink = `justscores://details/${props.sport}/${game.id}`

  return startActivity(
    props.awayTeamAbbr,
    props.homeTeamAbbr,
    props.sport,
    props.awayTeamId,
    props.homeTeamId,
    props.awayScore,
    props.homeScore,
    props.progressString,
    deepLink,
  )
}

export async function updateGameLiveActivity(
  activityId: string,
  game: Game,
): Promise<boolean> {
  try {
    const props = extractGameActivityProps(game)
    return await updateActivity(
      activityId,
      props.awayScore,
      props.homeScore,
      props.progressString,
    )
  } catch (error) {
    console.error("Failed to update Live Activity:", error)
    return false
  }
}
