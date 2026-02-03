import { HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui"
import {
  bold,
  font,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers"
import {
  LiveActivityComponent,
  startLiveActivity,
  updateLiveActivity,
} from "expo-widgets"
import { Game } from "@/types"

type GameActivityProps = {
  awayTeamAbbr: string
  awayScore: number
  homeTeamAbbr: string
  homeScore: number
  progressString: string
  isFootball: boolean
  hasPossession?: "home" | "away" | null
}

function createGameActivity(props: GameActivityProps): LiveActivityComponent {
  const {
    awayTeamAbbr,
    awayScore,
    homeTeamAbbr,
    homeScore,
    progressString,
    isFootball,
    hasPossession,
  } = props

  const awayWinning = awayScore > homeScore
  const homeWinning = homeScore > awayScore
  const sportIcon = isFootball ? "football.fill" : "basketball.fill"

  return () => ({
    banner: (
      <HStack alignment="center" modifiers={[padding({ all: 16 })]}>
        <VStack spacing={4} alignment="leading">
          <Text modifiers={[bold(), foregroundStyle("white")]}>{awayTeamAbbr}</Text>
          <Text modifiers={[font({ size: 32 }), bold(), foregroundStyle(awayWinning ? "white" : "gray")]}>
            {`${awayScore}`}
          </Text>
        </VStack>
        <Spacer />
        <VStack spacing={4} alignment="center">
          <Image systemName={sportIcon} size={24} color="gray" />
          <Text modifiers={[foregroundStyle("gray")]}>{progressString}</Text>
        </VStack>
        <Spacer />
        <VStack spacing={4} alignment="trailing">
          <Text modifiers={[bold(), foregroundStyle("white")]}>{homeTeamAbbr}</Text>
          <Text modifiers={[font({ size: 32 }), bold(), foregroundStyle(homeWinning ? "white" : "gray")]}>
            {`${homeScore}`}
          </Text>
        </VStack>
      </HStack>
    ),
    compactLeading: (
      <HStack spacing={4} alignment="center">
        <Text
          modifiers={[
            font({ weight: "semibold", size: 12 }),
            foregroundStyle("#FFFFFF"),
          ]}
        >
          {awayTeamAbbr}
        </Text>
        <Text
          modifiers={[
            font({ weight: "bold", size: 14 }),
            foregroundStyle("#FFFFFF"),
          ]}
        >
          {String(awayScore)}
        </Text>
      </HStack>
    ),
    compactTrailing: (
      <HStack spacing={4} alignment="center">
        <Text
          modifiers={[
            font({ weight: "bold", size: 14 }),
            foregroundStyle("#FFFFFF"),
          ]}
        >
          {String(homeScore)}
        </Text>
        <Text
          modifiers={[
            font({ weight: "semibold", size: 12 }),
            foregroundStyle("#FFFFFF"),
          ]}
        >
          {homeTeamAbbr}
        </Text>
      </HStack>
    ),
    minimal: (
      <Text
        modifiers={[
          font({ weight: "bold", size: 11 }),
          foregroundStyle("#FFFFFF"),
        ]}
      >
        {`${awayScore}-${homeScore}`}
      </Text>
    ),
    expandedLeading: (
      <VStack spacing={4} alignment="center" modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[bold(), foregroundStyle("white")]}>{awayTeamAbbr}</Text>
        <Text modifiers={[font({ size: 32 }), bold(), foregroundStyle("white")]}>
          {`${awayScore}`}
        </Text>
      </VStack>
    ),
    expandedTrailing: (
      <VStack spacing={4} alignment="center" modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[bold(), foregroundStyle("white")]}>{homeTeamAbbr}</Text>
        <Text modifiers={[font({ size: 32 }), bold(), foregroundStyle("white")]}>
          {`${homeScore}`}
        </Text>
      </VStack>
    ),
    expandedBottom: (
      <VStack modifiers={[padding({ horizontal: 12, top: 8, bottom: 12 })]}>
        <HStack spacing={6} alignment="center">
          <Image systemName={sportIcon} size={14} color="gray" />
          <Text modifiers={[foregroundStyle("gray")]}>{progressString}</Text>
        </HStack>
        <Spacer />
      </VStack>
    ),
  })
}

export function extractGameActivityProps(game: Game): GameActivityProps {
  const awayScore = game.box_score?.score?.away?.score ?? 0
  const homeScore = game.box_score?.score?.home?.score ?? 0
  const progressString = game.box_score?.progress?.string ?? ""
  const isFootball =
    game.api_uri.includes("nfl") || game.api_uri.includes("ncaaf")

  let hasPossession: "home" | "away" | null = null
  if (
    "team_in_possession" in game.box_score &&
    game.box_score.team_in_possession
  ) {
    const possessionTeamName = game.box_score.team_in_possession.name
    if (possessionTeamName === game.home_team.name) {
      hasPossession = "home"
    } else if (possessionTeamName === game.away_team.name) {
      hasPossession = "away"
    }
  }

  return {
    awayTeamAbbr: game.away_team.abbreviation,
    awayScore,
    homeTeamAbbr: game.home_team.abbreviation,
    homeScore,
    progressString,
    isFootball,
    hasPossession,
  }
}

export function startGameLiveActivity(game: Game): string {
  const props = extractGameActivityProps(game)
  const activity = createGameActivity(props)
  const gameId = game.id
  const sport = game.api_uri.includes("nfl")
    ? "nfl"
    : game.api_uri.includes("ncaaf")
      ? "ncaaf"
      : "ncaab"

  return startLiveActivity(
    "GameScoreActivity",
    activity,
    `justscores://details/${sport}/${gameId}`,
  )
}

export function updateGameLiveActivity(
  activityId: string,
  game: Game,
): boolean {
  try {
    const props = extractGameActivityProps(game)
    const activity = createGameActivity(props)
    updateLiveActivity(activityId, "GameScoreActivity", activity)
    return true
  } catch (error) {
    console.error("Failed to update Live Activity:", error)
    return false
  }
}
