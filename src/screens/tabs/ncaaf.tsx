import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { GamePreview } from "@/components/game-preview"
import { useSchedule } from "@/lib/hooks"

export function NcaaFB() {
  let [selectedConference, setSelectedConference] = useState("Top 25")
  let [selectedWeek, setSelectedWeek] = useState("2024-1")
  let { data, status } = useSchedule("ncaaf", selectedConference, selectedWeek)

  if (status !== "success") {
    return <Text className="flex-1 text-center">loading...</Text>
  }

  if (!data) {
    return <Text className="flex-1 text-center">No games found</Text>
  }

  return (
    <View className="pt-4 px-2 flex-1">
      <FlashList
        horizontal
        estimatedItemSize={52}
        data={data.events.current_season}
        extraData={selectedWeek}
        ItemSeparatorComponent={() => <View className="w-2" />}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedWeek(item.id)}
              className={`px-3 py-2 rounded-full border ${selectedWeek === item.id ? "bg-amber-50 border-amber-800" : ""}`}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )
        }}
      />
      <View className="h-3" />
      <FlashList
        horizontal
        estimatedItemSize={52}
        data={data?.conferences}
        extraData={selectedConference}
        ItemSeparatorComponent={() => <View className="w-2" />}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => setSelectedConference(item)}
              className={`px-3 py-2 rounded-full border ${selectedConference === item ? "bg-amber-50 border-amber-800" : ""}`}
            >
              <Text
              // className={selectedConference === item ? "font-bold" : ""}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
      <View className="h-6" />
      <FlashList
        data={data.games}
        estimatedItemSize={219}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <View className="border-b" />}
        renderItem={({ index, item }) => {
          let currentGameDate = new Date(item.game_date).toLocaleDateString()
          let previousGameDate =
            index > 0
              ? new Date(data.games[index - 1]?.game_date).toLocaleDateString()
              : null

          return (
            <View className="pl-2 pr-8">
              {(index === 0 || currentGameDate !== previousGameDate) && (
                <Text className="mt-4 font-bold">{currentGameDate}</Text>
              )}
              <View
                className={`relative flex flex-col gap-2 ${item.status === "in_progress" ? "active" : ""}`}
              >
                <GamePreview game={item} />
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}
