import React, { useEffect, useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"
import * as Haptics from "expo-haptics"
import { FlashList } from "@shopify/flash-list"
import { GamePreview } from "@/components/game-preview"
import { Text } from "@/components/text"
import { useConferences, useGames, useSchedule } from "@/lib/hooks"
import { TabScreenProps } from "../types"

type Props = TabScreenProps<"scores">
export function SportSchedule({ route }: Props) {
  let isCollege = route.params.sport.includes("ncaa")
  let [selectedConference, setSelectedConference] = useState(
    isCollege ? "Top 25" : undefined,
  )
  let { data: conferences } = useConferences(route.params.sport)
  let { data: events, status: eventsStatus } = useSchedule(
    route.params.sport,
    selectedConference,
  )
  let [selectedWeek, setSelectedWeek] = useState("")
  let eventIds: number[] = useMemo(() => {
    if (!events) return []

    return (
      events.current_season?.find((w) => w.id === selectedWeek)?.event_ids ??
      events?.current_group?.event_ids
    )
  }, [events, selectedConference, selectedWeek])
  let { data: games, refetch } = useGames(route.params.sport, eventIds)
  let [isRefetching, setIsRefetching] = useState(false)

  useEffect(() => {
    if (eventsStatus === "success") {
      setSelectedWeek(events?.current_group.id ?? "2024-1")
    }
  }, [eventsStatus])

  return (
    <View className="pt-4 px-2 flex-1 bg-zinc-900">
      {!!conferences?.length && (
        <FlashList
          horizontal
          estimatedItemSize={52}
          data={conferences}
          extraData={selectedConference}
          ItemSeparatorComponent={() => <View className="w-2" />}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedConference(item)
                }}
                className={`px-3 py-2 rounded-full border ${selectedConference === item ? "border-indigo-900" : "border-zinc-800"}`}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
      {!!conferences?.length && <View className="h-3" />}
      {events && (
        <FlashList
          horizontal
          estimatedItemSize={52}
          data={events.current_season}
          extraData={selectedWeek}
          ItemSeparatorComponent={() => <View className="w-2" />}
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={events?.current_season.findIndex(
            (s) => s.id === events?.current_group.id,
          )}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedWeek(item.id)
                }}
                className={`px-3 py-2 rounded-full border ${selectedWeek === item.id ? "border-indigo-900" : "border-zinc-800"}`}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
      <View className="h-6" />
      {games && games.length ? (
        <FlashList
          data={games}
          estimatedItemSize={219}
          onRefresh={() => {
            setIsRefetching(true)
            refetch()
            setTimeout(() => setIsRefetching(false), 1500)
          }}
          refreshing={isRefetching}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => (
            <View className="border-b border-zinc-800" />
          )}
          renderItem={({ index, item }) => {
            let currentGameDate = new Date(item.game_date).toLocaleDateString()
            let previousGameDate =
              index > 0
                ? new Date(games[index - 1]?.game_date).toLocaleDateString()
                : null

            return (
              <View className="pl-2 pr-8">
                {(index === 0 || currentGameDate !== previousGameDate) && (
                  <Text className="mt-4 font-bold">{currentGameDate}</Text>
                )}
                <View
                  className={`relative flex flex-col gap-2 ${item.status === "in_progress" ? "active" : ""}`}
                >
                  <GamePreview game={item} sport={route.params.sport} />
                </View>
              </View>
            )
          }}
        />
      ) : (
        <></>
      )}
    </View>
  )
}
