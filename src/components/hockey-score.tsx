import React from "react"
import { Image, View } from "react-native"
import { HockeyPlayRecord, NHLEvent } from "@/types"
import { Text } from "./text"

export function HockeyScore({
  game,
  plays,
}: {
  game: NHLEvent
  plays?: HockeyPlayRecord[]
}) {
  const lineScores = game.box_score?.line_scores
  const hasLineScores =
    (lineScores?.home?.length ?? 0) > 0 && (lineScores?.away?.length ?? 0) > 0
  const goals = getScoringPlays(plays ?? [])

  if (!hasLineScores && goals.length === 0) return null

  return (
    <View className="mt-4">
      {hasLineScores && (
        <View className="mt-4">
          <View className="flex-row justify-between border-b border-zinc-300 dark:border-zinc-700 pb-2">
            <Text className="text-zinc-500 dark:text-zinc-400 w-24"> </Text>
            {lineScores!.home.map((segment, index) => (
              <Text
                key={`${segment.segment_string}-${segment.segment}-${index}`}
                className="text-zinc-500 dark:text-zinc-400 w-12 text-center"
              >
                {segment.segment_string}
              </Text>
            ))}
            <Text className="text-zinc-500 dark:text-zinc-400 w-12 text-center">
              T
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
            <Text className="text-zinc-900 dark:text-zinc-100 w-24">
              {game.away_team.abbreviation}
            </Text>
            {lineScores!.away.map((segment, index) => (
              <Text
                key={`${segment.segment_string}-${segment.segment}-${index}`}
                className="text-zinc-900 dark:text-zinc-100 w-12 text-center tabular-nums"
              >
                {segment.score}
              </Text>
            ))}
            <Text className="text-zinc-900 dark:text-zinc-100 w-12 text-center tabular-nums font-bold">
              {game.box_score.score.away.score}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-zinc-900 dark:text-zinc-100 w-24">
              {game.home_team.abbreviation}
            </Text>
            {lineScores!.home.map((segment, index) => (
              <Text
                key={`${segment.segment_string}-${segment.segment}-${index}`}
                className="text-zinc-900 dark:text-zinc-100 w-12 text-center tabular-nums"
              >
                {segment.score}
              </Text>
            ))}
            <Text className="text-zinc-900 dark:text-zinc-100 w-12 text-center tabular-nums font-bold">
              {game.box_score.score.home.score}
            </Text>
          </View>
        </View>
      )}
      {goals.length > 0 && (
        <View className="mt-8 gap-3">
          <Text className="text-xl">Scoring Summary</Text>
          {goals.map((goal) => (
            <GoalRow key={goal.id} game={game} goal={goal} />
          ))}
        </View>
      )}
    </View>
  )
}

function GoalRow({ game, goal }: { game: NHLEvent; goal: HockeyPlayRecord }) {
  const team = goal.alignment === "home" ? game.home_team : game.away_team
  const score =
    goal.away_score_after != null && goal.home_score_after != null
      ? `${goal.away_score_after}-${goal.home_score_after}`
      : null
  const assists = getAssistText(goal.description)

  return (
    <View className="flex-row gap-3 py-3 border-b border-zinc-200 dark:border-zinc-800">
      <Image
        source={{ uri: team.logos.tiny }}
        className="w-8 h-8 mt-0.5"
        accessibilityLabel={`${team.name} logo`}
      />
      <View className="flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="font-semibold flex-1">
            {goal.scorer?.full_name ??
              getScorerFromDescription(goal.description)}
          </Text>
          {score && (
            <Text className="text-sm font-semibold tabular-nums">{score}</Text>
          )}
        </View>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          {goal.progress.clock_label}
          {goal.event_type?.toLowerCase().includes("shootout")
            ? " · Shootout"
            : ""}
        </Text>
        {assists && (
          <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {assists}
          </Text>
        )}
      </View>
    </View>
  )
}

function getScoringPlays(plays: HockeyPlayRecord[]) {
  return plays
    .filter(
      (play) =>
        play.is_scoring_play ||
        play.event_type?.toLowerCase() === "goal" ||
        play.event_type?.toLowerCase() === "shootoutgoal",
    )
    .sort((a, b) => {
      if (a.segment !== b.segment) return a.segment - b.segment
      if (a.minutes !== b.minutes) return b.minutes - a.minutes
      return b.seconds - a.seconds
    })
}

function getAssistText(description: string): string | null {
  const assistedBy = description.match(/assisted by (.+)$/i)?.[1]
  if (assistedBy) return `Assists: ${assistedBy}`
  if (description.toLowerCase().includes("unassisted")) return "Unassisted"
  return null
}

function getScorerFromDescription(description: string): string {
  return (
    description.match(/Goal scored by (.+?)( assisted by| on |$)/i)?.[1] ??
    description.match(/Shootout Goal scored by (.+?)( on |$)/i)?.[1] ??
    "Goal"
  )
}
