import React from "react"
import { Image, Text, View } from "react-native"
import { NcaaFBEvent, NFLEvent } from "@/types"

export function FootballScore({ game }: { game: NcaaFBEvent | NFLEvent }) {
  return (
    <View className="mt-4">
      {game.status === "in_progress" && game.box_score.down && (
        <Text className="mt-4 text-xl">
          {game.box_score.down}
          {getDownOrdinal(game.box_score.down)} and {game.box_score.distance}{" "}
          from {game.box_score.ball_on}
        </Text>
      )}

      {game.box_score?.last_play?.details && (
        <View className="mt-4 text-sm">
          <Text className="text-xl">Last Play</Text>
          <Text className="mt-2">{game.box_score.last_play.details}</Text>
        </View>
      )}

      {game.box_score?.scoring_summary && (
        <View className="flex gap-6 my-8 text-xs">
          <Text className="text-xl">Scoring Summary</Text>
          {game.box_score.scoring_summary.map((summary, index) => {
            let logo = summary.scorer.teams[0].logos.small
            let teamColor = summary.scorer?.teams[0].colour_1

            return (
              <View
                key={index}
                className="flex flex-row items-center pt-2 gap-2 pl-2"
              >
                <Image
                  className="absolute z-10 object-cover w-8 h-8 -left-1 -bottom-3"
                  source={{ uri: logo }}
                  accessibilityLabel={`${summary.team} logo`}
                />
                {summary.scorer?.headshots?.original ? (
                  <Image
                    className="object-cover w-12 h-12 rounded-full"
                    style={{ borderWidth: 2, borderColor: `#${teamColor}` }}
                    source={{ uri: summary.scorer.headshots.small }}
                    accessibilityLabel={summary.scorer.full_name}
                  />
                ) : (
                  <View />
                )}
                <Text className="flex-shrink">{summary.summary_text}</Text>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

function getDownOrdinal(number: number) {
  switch (number) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    case 4:
      return "th"
    default:
      return "th"
  }
}
