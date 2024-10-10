import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Game } from "@/types"
import TeamLine from "./team-line"

export function GamePreview({ game }: { game: Game }) {
  let navigation = useNavigation()
  let route = useRoute()

  function renderGameStatus() {
    if (game.status !== "pre_game") {
      return (
        <Text className="w-20 text-right">
          {game.box_score?.progress.string}
        </Text>
      )
    } else {
      let gameTime = new Date(game.game_date).toLocaleTimeString(undefined, {
        timeStyle: "short",
      })
      return <Text className="w-[4ch]">{gameTime}</Text>
    }
  }

  return (
    <TouchableOpacity
      className="text-lg active flex flex-row items-center gap-2 py-4"
      onPress={() => {
        if (
          route.name !== "nfl" &&
          route.name !== "ncaab" &&
          route.name !== "ncaaf"
        ) {
          throw new Error(`invalid route name: ${route.name}`)
        }
        navigation.navigate("GameDetails", {
          sport: route.name,
          id: String(game.id),
        })
      }}
    >
      {game.status === "in_progress" ? (
        <View className="w-3 h-3 rounded-full bg-emerald-500" />
      ) : (
        <View className="w-3 h-3 rounded-full bg-transparent" />
      )}
      <View className="flex flex-row items-center gap-2">
        <View className="flex flex-col flex-1 gap-3">
          <TeamLine team={game.away_team} type="away" game={game} />
          <TeamLine team={game.home_team} type="home" game={game} />
        </View>
        {renderGameStatus()}
      </View>
    </TouchableOpacity>
  )
}
