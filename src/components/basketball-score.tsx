import React from "react"
import { Text, View } from "react-native"
import { NcaaBBEvent } from "@/types"

export function BasketballScore({ game }: { game: NcaaBBEvent }) {
  return (
    <View className="mt-4">
      {game?.box_score?.last_play?.description && (
        <View className="mt-4 text-sm">
          <Text className="text-xl text-zinc-100">Last Play</Text>
          <Text className="mt-2 text-zinc-100">
            {game.box_score.last_play?.description}
          </Text>
        </View>
      )}
    </View>
  )
}
