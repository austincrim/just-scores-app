import React from "react"
import { View, Text } from "react-native"
import { FlashList } from "@shopify/flash-list"
import GamePreview from "./game-preview"
import { type Game } from "@/types"

export function Schedule({ games }: { games: Array<Game> }) {
  return (
    <FlashList
      data={games}
      estimatedItemSize={219}
      renderItem={({ index, item }) => {
        let currentGameDate = new Date(item.game_date).toLocaleDateString()
        let previousGameDate =
          index > 0
            ? new Date(games[index - 1]?.game_date).toLocaleDateString()
            : null

        return (
          <View className="px-8">
            {(index === 0 || currentGameDate !== previousGameDate) && (
              <Text className="mt-4 font-bold">{currentGameDate}</Text>
            )}
            <View
              className={`relative flex flex-col w-full gap-2 ${item.status === "in_progress" ? "active" : ""}`}
            >
              <GamePreview game={item} />
            </View>
          </View>
        )
      }}
      keyExtractor={(item) => String(item.id)}
    />
  )
}
