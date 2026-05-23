import React from "react"
import { View } from "react-native"
import { NHLEvent } from "@/types"
import { Text } from "./text"

export function HockeyScore({ game }: { game: NHLEvent }) {
  const lineScores = game.box_score?.line_scores
  const hasLineScores =
    (lineScores?.home?.length ?? 0) > 0 && (lineScores?.away?.length ?? 0) > 0

  if (!hasLineScores) return null

  return (
    <View className="mt-4">
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
          <Text className="text-zinc-500 dark:text-zinc-400 w-12 text-center">T</Text>
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
    </View>
  )
}
