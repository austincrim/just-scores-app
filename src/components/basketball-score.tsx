import React from "react"
import { Image, Text, View } from "react-native"
import { NcaaBBEvent, NcaaBBEventStats } from "@/types"

export function BasketballScore({
  game,
  stats,
}: {
  game: NcaaBBEvent
  stats: NcaaBBEventStats
}) {
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
