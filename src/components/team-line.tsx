import { BBTeam, FBTeam, Game } from "@/types"
import React from "react"
import { View, Text, Image } from "react-native"

type Props = {
  team: BBTeam | FBTeam
  game: Game
  type: "away" | "home"
}

function TeamLine({ team, game, type }: Props) {
  let score = game.box_score?.score[type].score
  let ranking = game[`${type}_ranking`]

  function renderScore() {
    if (score !== undefined) {
      return <Text className="font-bold">{score}</Text>
    } else if (game.status !== "pre_game") {
      return <Text className="font-bold">0</Text>
    }
    return null
  }

  return (
    <View className="flex flex-row items-center justify-between gap-1">
      <View className="flex flex-row items-center gap-1">
        <Image
          source={{ uri: team.logos.large }}
          className="w-6 h-6"
          accessibilityLabel={`${team.full_name} logo`}
        />
        {ranking && <Text className="text-xs font-bold">{ranking}</Text>}
        <Text className="text-lg max-w-52">{team.name}</Text>
      </View>

      {renderScore()}
    </View>
  )
}

export default TeamLine
