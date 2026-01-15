import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import * as Haptics from "expo-haptics"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useNavigation } from "@react-navigation/native"
import { format, isToday, isTomorrow } from "date-fns"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import colors from "tailwindcss/colors"
import { GamePreview } from "@/components/game-preview"
import { Text } from "@/components/text"
import { useConferences, useGames, useSchedule } from "@/lib/hooks"
import { TabScreenProps } from "../types"

type Props = TabScreenProps<"scores">

export function SportSchedule({ route }: Props) {
  let isCollege = route.params.sport.includes("ncaa")
  let isDark = useColorScheme() === "dark"
  let scheduleSheetRef = useRef<TrueSheet>(null)
  let conferenceSheetRef = useRef<TrueSheet>(null)
  let navigation = useNavigation()
  let [selectedConference, setSelectedConference] = useState(
    isCollege ? "Top 25" : undefined,
  )
  let [selectedWeek, setSelectedWeek] = useState("")
  let [isRefetching, setIsRefetching] = useState(false)

  let { data: conferences } = useConferences(route.params.sport)
  let { data: events, status: eventsStatus } = useSchedule(
    route.params.sport,
    selectedConference,
  )
  let eventIds: number[] = useMemo(() => {
    if (!events) return []

    return (
      events.current_season?.find((w) => w.id === selectedWeek)?.event_ids ??
      events?.current_group?.event_ids
    )
  }, [events, selectedWeek])
  let { data: games, refetch } = useGames(route.params.sport, eventIds)

  if (selectedWeek === "" && eventsStatus === "success") {
    setSelectedWeek(events?.current_group?.id ?? "2025-1")
  }

  const changeScheduleGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      const swipeThreshold = 50
      const { translationX } = e

      if (events?.current_season) {
        const currentIndex = events.current_season.findIndex(
          (s) => s.id === selectedWeek,
        )

        if (translationX > swipeThreshold && currentIndex > 0) {
          setSelectedWeek(events.current_season[currentIndex - 1].id)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } else if (
          translationX < -swipeThreshold &&
          currentIndex < events.current_season.length - 1
        ) {
          setSelectedWeek(events.current_season[currentIndex + 1].id)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        }
      }
    })
    .runOnJS(true)

  useEffect(() => {
    if (selectedWeek) {
      navigation.setOptions({
        headerRight: () => (
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              marginRight: 16,
            }}
          >
            <Pressable
              onPress={() => scheduleSheetRef.current?.present()}
              className="flex-row items-center gap-1"
            >
              <Text
                style={{
                  color: isDark ? colors.sky[300] : colors.sky[600],
                  borderColor: isDark ? colors.sky[300] : colors.sky[600],
                  borderBottomWidth: 1,
                }}
              >
                {
                  events?.current_season.find((s) => s.id === selectedWeek)
                    ?.label
                }
              </Text>
            </Pressable>
          </View>
        ),
      })
    }
    if (selectedConference) {
      navigation.setOptions({
        headerLeft: () => (
          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}
          >
            <Pressable
              onPress={() => conferenceSheetRef.current?.present()}
              className="flex-row items-center gap-1"
            >
              <Text
                style={{
                  color: isDark ? colors.sky[300] : colors.sky[600],
                  borderColor: isDark ? colors.sky[300] : colors.sky[600],
                  borderBottomWidth: 1,
                }}
              >
                {selectedConference}
              </Text>
            </Pressable>
          </View>
        ),
      })
    }
  }, [selectedWeek, selectedConference, isDark])

  return (
    <GestureDetector gesture={changeScheduleGesture}>
      <View className="p-2 px-4 flex-1">
        {games && (
          <FlatList
            data={games}
            extraData={selectedWeek}
            showsVerticalScrollIndicator={false}
            onRefresh={() => {
              setIsRefetching(true)
              refetch()
              setTimeout(() => setIsRefetching(false), 1500)
            }}
            refreshing={isRefetching}
            keyExtractor={(item) => `${String(item.id)}-${selectedWeek}`}
            ItemSeparatorComponent={() => (
              <View
                className="border-zinc-200 dark:border-zinc-700"
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
                  : format(gameDate, "E · MMMM do")
              let previousGameDate =
                index > 0
                  ? new Date(games[index - 1]?.game_date).toLocaleDateString()
                  : null

              return (
                <View style={{ flex: 1 }}>
                  {(index === 0 ||
                    currentDateFormatted !== previousGameDate) && (
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
        )}

        <TrueSheet scrollable ref={scheduleSheetRef} detents={[0.7]}>
          <ScrollView className="py-4" nestedScrollEnabled>
            {events?.current_season.map((event) => (
              <Pressable
                key={event.id}
                className="p-4"
                hitSlop={5}
                onPress={() => {
                  setSelectedWeek(event.id)
                  scheduleSheetRef.current?.dismiss()
                }}
              >
                <Text
                  style={
                    event.id === events.current_group.id && {
                      color: isDark ? colors.sky[300] : colors.sky[600],
                    }
                  }
                >
                  {event.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </TrueSheet>
        <TrueSheet scrollable ref={conferenceSheetRef} detents={[0.7]}>
          <ScrollView className="py-4" nestedScrollEnabled>
            {conferences?.map((conference) => (
              <Pressable
                key={conference}
                className="p-4"
                hitSlop={5}
                onPress={() => {
                  setSelectedConference(conference)
                  setSelectedWeek("")
                  conferenceSheetRef.current?.dismiss()
                }}
              >
                <Text
                  style={
                    selectedConference === conference && {
                      color: isDark ? colors.sky[300] : colors.sky[600],
                    }
                  }
                >
                  {conference}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </TrueSheet>
      </View>
    </GestureDetector>
  )
}
