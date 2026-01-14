import React, { ReactElement } from "react"
import { Image, View } from "react-native"
import { Game, Team } from "@/types"
import { Text } from "./text"

type Props = {
  team: Team
  game: Game
  type: "away" | "home"
  renderStatus?: () => ReactElement
}

function TeamLine({ team, game, type, renderStatus }: Props) {
  let score = game.box_score?.score[type].score
  let ranking = game[`${type}_ranking`]

  function renderScore() {
    if (game.status === "pre_game") {
      return null
    }
    return <Text className="font-bold text-lg">{score ?? 0}</Text>
  }

  return (
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex flex-row flex-1 items-center justify-between gap-1">
        <View className="flex flex-row items-center gap-1">
          <Image
            source={{ uri: team.logos.large ?? team.logos.w72xh72 }}
            className="w-8 h-8"
            accessibilityLabel={`${team.full_name} logo`}
          />
          {ranking && <Text className="text-xs font-bold">{ranking}</Text>}
          <Text className="text-lg max-w-52">
            {team.name ?? team.medium_name ?? team.abbreviation}
          </Text>
        </View>

        {renderScore()}
      </View>

      {renderStatus ? (
        <View style={{ minWidth: 80 }}>{renderStatus()}</View>
      ) : (
        <View style={{ minWidth: 80 }} />
      )}
    </View>
  )
}

export default TeamLine
