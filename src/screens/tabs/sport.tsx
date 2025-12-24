import React, { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { LegendList } from "@legendapp/list"
import { format, isToday, isTomorrow } from "date-fns"
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
  }, [events, selectedWeek])
  let { data: games, refetch } = useGames(route.params.sport, eventIds)
  let [isRefetching, setIsRefetching] = useState(false)

  if (selectedWeek === "" && eventsStatus === "success") {
    setSelectedWeek(events?.current_group.id ?? "2025-1")
  }

  return (
    <View className="p-2 flex-1">
      {/*{!!conferences?.length && (
        <LegendList
          horizontal
          data={conferences}
          extraData={selectedConference}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedConference(item)
                }}
                className={`px-3 py-2 rounded-full border ${selectedConference === item ? "border-emerald-900" : "border-zinc-800"}`}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
      {events && (
        <LegendList
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
                className={`px-3 py-2 rounded-full border ${selectedWeek === item.id ? "border-emerald-900" : "border-zinc-800"}`}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}*/}
      {games && games.length ? (
        <LegendList
          data={games}
          showsVerticalScrollIndicator={false}
          onRefresh={() => {
            setIsRefetching(true)
            refetch()
            setTimeout(() => setIsRefetching(false), 1500)
          }}
          refreshing={isRefetching}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => (
            <View
              className="border-zinc-200"
              style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            />
          )}
          renderItem={({ index, item }) => {
            let gameDate = new Date(item.game_date)
            let currentDateFormatted = gameDate.toLocaleDateString()
            let displayDate = isToday(gameDate)
              ? "Today"
              : isTomorrow(gameDate)
                ? "Tomorrow"
                : format(gameDate, "MMMM do")
            let previousGameDate =
              index > 0
                ? new Date(games[index - 1]?.game_date).toLocaleDateString()
                : null

            return (
              <View>
                {(index === 0 || currentDateFormatted !== previousGameDate) && (
                  <Text className="mt-4 font-bold">{displayDate}</Text>
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
