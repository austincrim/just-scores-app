import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import * as Haptics from "expo-haptics"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import { useNavigation } from "@react-navigation/native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import colors from "tailwindcss/colors"
import { GamePreview } from "@/components/game-preview"
import { Text } from "@/components/text"
import { Sport, SPORTS, useAllSportsGames } from "@/lib/hooks"
import { generateDays, getTodayId } from "@/lib/weeks"
import { Game } from "@/types"

const SPORT_LABELS: Record<Sport, string> = {
  nfl: "NFL",
  ncaaf: "NCAA Football",
  ncaab: "NCAA Basketball",
}

type SectionData = {
  sport: Sport
  title: string
  data: Game[]
}

export function AllSportsView() {
  const isDark = useColorScheme() === "dark"
  const navigation = useNavigation()
  const scheduleSheetRef = useRef<TrueSheet>(null)
  const [isRefetching, setIsRefetching] = useState(false)

  const days = useMemo(() => generateDays(), [])
  const [selectedDayId, setSelectedDayId] = useState(getTodayId())

  const selectedDay = useMemo(
    () => days.find((d) => d.id === selectedDayId) ?? days[0],
    [days, selectedDayId],
  )

  const { data: games, refetch } = useAllSportsGames(selectedDay.date)

  const sections: SectionData[] = useMemo(() => {
    if (!games) return []

    return SPORTS.map((sport) => ({
      sport,
      title: SPORT_LABELS[sport],
      data: games[sport],
    })).filter((section) => section.data.length > 0)
  }, [games])

  const changeScheduleGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      const swipeThreshold = 50
      const { translationX } = e
      const currentIndex = days.findIndex((d) => d.id === selectedDayId)

      if (translationX > swipeThreshold && currentIndex > 0) {
        setSelectedDayId(days[currentIndex - 1].id)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } else if (
        translationX < -swipeThreshold &&
        currentIndex < days.length - 1
      ) {
        setSelectedDayId(days[currentIndex + 1].id)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      }
    })
    .runOnJS(true)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flex: 1, alignItems: "flex-end", marginRight: 16 }}>
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
              {selectedDay.label}
            </Text>
          </Pressable>
        </View>
      ),
    })
  }, [selectedDay, isDark, navigation])

  return (
    <GestureDetector gesture={changeScheduleGesture}>
      <View className="flex-1 p-2 px-4">
        <SectionList
          sections={sections}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          onRefresh={() => {
            setIsRefetching(true)
            refetch()
            setTimeout(() => setIsRefetching(false), 1500)
          }}
          refreshing={isRefetching}
          keyExtractor={(item) => `${item.id}-${selectedDayId}`}
          renderSectionHeader={({ section }) => (
            <View className="mb-2 mt-6 flex-row items-center gap-2">
              <Text className="text-lg font-bold">{section.title}</Text>
              <Text className="text-zinc-500 dark:text-zinc-400">
                {section.data.length} game{section.data.length !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              className="border-zinc-200 dark:border-zinc-700"
              style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            />
          )}
          renderItem={({ item, section }) => (
            <View
              className={`relative flex flex-col gap-2 ${item.status === "in_progress" ? "active" : ""}`}
            >
              <GamePreview game={item} sport={section.sport} />
            </View>
          )}
        />

        <TrueSheet scrollable ref={scheduleSheetRef} detents={[0.5]}>
          <ScrollView className="py-4" nestedScrollEnabled>
            {days.map((day) => (
              <Pressable
                key={day.id}
                className="p-4"
                hitSlop={5}
                onPress={() => {
                  setSelectedDayId(day.id)
                  scheduleSheetRef.current?.dismiss()
                }}
              >
                <Text
                  style={
                    day.id === getTodayId() && {
                      color: isDark ? colors.sky[300] : colors.sky[600],
                    }
                  }
                >
                  {day.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </TrueSheet>
      </View>
    </GestureDetector>
  )
}
