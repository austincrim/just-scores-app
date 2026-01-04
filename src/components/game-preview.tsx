import React from "react"
import { TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Game } from "@/types"
import TeamLine from "./team-line"
import { Text } from "./text"

export function GamePreview({
  game,
  sport,
  disabled = false,
}: {
  game: Game
  sport: "ncaaf" | "ncaab" | "nfl"
  disabled?: boolean
}) {
  let navigation = useNavigation()

  function renderGameStatus() {
    if (game.status !== "pre_game") {
      return (
        <Text className="text-lg text-right">
          {game.box_score?.progress.string}
        </Text>
      )
    } else {
      let gameTime = new Date(game.game_date).toLocaleTimeString(undefined, {
        timeStyle: "short",
      })
      return <Text className="text-lg text-right">{gameTime}</Text>
    }
  }

  return (
    <TouchableOpacity
      className="text-lg active flex flex-row items-center gap-2 py-4"
      disabled={disabled}
      onPress={() => {
        if (sport !== "nfl" && sport !== "ncaab" && sport !== "ncaaf") {
          throw new Error(`invalid route name: ${sport}`)
        }
        navigation.navigate("details", {
          sport,
          id: String(game.id),
        })
      }}
    >
      {game.status === "in_progress" && (
        <View className="w-3 h-3 rounded-full bg-emerald-500" />
      )}
      <View className="flex flex-row gap-2 items-center flex-shrink">
        <View className="flex flex-col flex-1 gap-1">
          <TeamLine team={game.away_team} type="away" game={game} />
          <TeamLine team={game.home_team} type="home" game={game} />
        </View>
        <View style={{ minWidth: 80 }}>{renderGameStatus()}</View>
      </View>
    </TouchableOpacity>
  )
}
