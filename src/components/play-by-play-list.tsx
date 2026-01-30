import React from "react"
import { Image, View } from "react-native"
import { Text } from "@/components/text"
import {
  BasketballPlayRecord,
  FootballPlayRecord,
  Game,
  PlayRecord,
} from "@/types"

type Props = {
  plays: PlayRecord[]
  game: Game
  isBasketball: boolean
}

export function PlayByPlayList({ plays, game, isBasketball }: Props) {
  const groupedPlays = groupPlaysBySegment(plays, isBasketball)
  const runningScores = isBasketball
    ? calculateBasketballScores(plays as BasketballPlayRecord[], game)
    : null

  return (
    <View className="mt-4 gap-4">
      {groupedPlays.map(({ segment, label, plays: segmentPlays }) => (
        <View key={segment} className="gap-2">
          <Text className="text-lg font-bold text-zinc-500 dark:text-zinc-400 mb-2">
            {label}
          </Text>
          {segmentPlays.map((play) =>
            isBasketball ? (
              <BasketballPlay
                key={play.id}
                play={play as BasketballPlayRecord}
                game={game}
                score={runningScores?.get(play.id) ?? { home: 0, away: 0 }}
              />
            ) : (
              <FootballPlay key={play.id} play={play as FootballPlayRecord} />
            ),
          )}
        </View>
      ))}
    </View>
  )
}

function BasketballPlay({
  play,
  game,
  score,
}: {
  play: BasketballPlayRecord
  game: Game
  score: { home: number; away: number }
}) {
  const team = play.team?.includes(String(game.home_team.id))
    ? game.home_team
    : play.team?.includes(String(game.away_team.id))
      ? game.away_team
      : null

  return (
    <View className="flex-row items-center gap-3 py-2 border-b border-zinc-200 dark:border-zinc-800">
      {team && (
        <Image
          source={{ uri: team.logos.tiny }}
          className="w-6 h-6"
          accessibilityLabel={`${team.name} logo`}
        />
      )}
      <View className="flex-1">
        <Text className="text-base">{play.description}</Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-semibold tabular-nums">
          {score.away}-{score.home}
        </Text>
        <Text className="text-xs text-zinc-500 dark:text-zinc-400 tabular-nums">
          {play.progress.clock}
        </Text>
      </View>
    </View>
  )
}

function FootballPlay({ play }: { play: FootballPlayRecord }) {
  const teamLogo = play.player1?.teams?.[0]?.logos?.tiny
  const isScoring =
    play.home_score_after !== play.home_score_before ||
    play.away_score_after !== play.away_score_before

  return (
    <View
      className={`py-2 border-b border-zinc-200 dark:border-zinc-800 ${isScoring ? "bg-amber-50 dark:bg-amber-950/30 -mx-2 px-2 rounded" : ""}`}
    >
      <View className="flex-row items-start gap-3">
        {teamLogo && (
          <Image
            source={{ uri: teamLogo }}
            className="w-6 h-6 mt-0.5"
            accessibilityLabel="Team logo"
          />
        )}
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            {play.down && play.distance && (
              <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                {ordinal(play.down)} & {play.distance}
              </Text>
            )}
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {play.header}
            </Text>
          </View>
          <Text className="text-base">{play.play_type}</Text>
          {isScoring && (
            <Text className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-1">
              {play.score.short_summary}
            </Text>
          )}
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {play.progress.clock}
          </Text>
        </View>
      </View>
    </View>
  )
}

function groupPlaysBySegment(plays: PlayRecord[], isBasketball: boolean) {
  const groups: Map<number, { label: string; plays: PlayRecord[] }> = new Map()

  for (const play of plays) {
    const segment = play.segment
    if (!groups.has(segment)) {
      const label = isBasketball
        ? segment === 1
          ? "1st Half"
          : segment === 2
            ? "2nd Half"
            : `OT ${segment - 2}`
        : `${ordinal(segment)} Quarter`
      groups.set(segment, { label, plays: [] })
    }
    groups.get(segment)!.plays.push(play)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([segment, data]) => ({ segment, ...data }))
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function calculateBasketballScores(
  plays: BasketballPlayRecord[],
  game: Game,
): Map<number, { home: number; away: number }> {
  const scores = new Map<number, { home: number; away: number }>()
  let homeScore = 0
  let awayScore = 0

  const sortedPlays = [...plays].sort((a, b) => {
    if (a.segment !== b.segment) return a.segment - b.segment
    if (a.minutes !== b.minutes) return b.minutes - a.minutes
    return b.seconds - a.seconds
  })

  for (const play of sortedPlays) {
    const points = getPointsFromDescription(play.description)
    if (points > 0 && play.team) {
      const isHome = play.team.includes(String(game.home_team.id))
      if (isHome) {
        homeScore += points
      } else {
        awayScore += points
      }
    }
    scores.set(play.id, { home: homeScore, away: awayScore })
  }

  return scores
}

function getPointsFromDescription(description: string): number {
  const lower = description.toLowerCase()
  if (!lower.includes("makes")) return 0
  if (lower.includes("three point")) return 3
  if (lower.includes("two point")) return 2
  if (lower.includes("free throw")) return 1
  if (lower.includes("layup") || lower.includes("dunk")) return 2
  if (lower.includes("jump shot") && !lower.includes("three")) return 2
  return 0
}
