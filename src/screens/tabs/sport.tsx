import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import * as Haptics from "expo-haptics"
import { LegendList } from "@legendapp/list"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useNavigation } from "@react-navigation/native"
import { format, isToday, isTomorrow } from "date-fns"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
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
  let [isSwiping, setIsSwiping] = useState(false)

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

  const swipeDirection = useSharedValue<-1 | 1>(1)
  const animationProgress = useSharedValue(0)
  const prevGamesRef = useRef(games)

  if (selectedWeek === "" && eventsStatus === "success") {
    setSelectedWeek(events?.current_group.id ?? "2025-1")
  }

  // Trigger entry animation when games first load
  useEffect(() => {
    if (games && !prevGamesRef.current && games.length > 0) {
      animationProgress.value = 0
      animationProgress.value = withSpring(1, { duration: 100 })
    }
    prevGamesRef.current = games
  }, [games])

  const changeScheduleGesture = Gesture.Pan()
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      const swipeThreshold = 50
      const { translationX } = e

      if (events?.current_season) {
        const currentIndex = events.current_season.findIndex(
          (s) => s.id === selectedWeek,
        )

        if (translationX > swipeThreshold && currentIndex > 0) {
          swipeDirection.value = 1
          setIsSwiping(true)
          setSelectedWeek(events.current_season[currentIndex - 1].id)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setTimeout(() => {
            setIsSwiping(false)
          }, 400)
        } else if (
          translationX < -swipeThreshold &&
          currentIndex < events.current_season.length - 1
        ) {
          swipeDirection.value = -1
          setIsSwiping(true)
          setSelectedWeek(events.current_season[currentIndex + 1].id)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setTimeout(() => {
            setIsSwiping(false)
          }, 400)
        }
      }
    })
    .runOnJS(true)

  useEffect(() => {
    animationProgress.value = 0
    animationProgress.value = withSpring(1, { duration: 100 })
  }, [selectedWeek])

  const animatedStyle = useAnimatedStyle(() => {
    const direction = swipeDirection.value
    const phase = animationProgress.value

    return {
      opacity: interpolate(phase, [0, 1], [0.6, 1], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            phase,
            [0, 0.5, 1],
            [0, direction * 10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }
  })

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
              {/*<SymbolView size={14} name="chevron.down" />*/}
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
          <Animated.View style={animatedStyle}>
            <LegendList
              data={games}
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
                    {(index === 0 ||
                      currentDateFormatted !== previousGameDate) && (
                      <Text className="mt-4 font-bold">{displayDate}</Text>
                    )}
                    <View
                      className={`relative flex flex-col gap-2 ${item.status === "in_progress" ? "active" : ""}`}
                    >
                      <GamePreview
                        game={item}
                        sport={route.params.sport}
                        disabled={isSwiping}
                      />
                    </View>
                  </View>
                )
              }}
            />
          </Animated.View>
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
