import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  AppState,
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
import { useMMKVObject } from "react-native-mmkv"
import colors from "tailwindcss/colors"
import {
  GameListSkeleton,
  SkeletonLine,
} from "@/components/game-details-skeleton"
import { GamePreview } from "@/components/game-preview"
import { Text } from "@/components/text"
import { Sport, SPORTS, useAllSportsGames } from "@/lib/hooks"
import { FAVORITES_KEY, storage } from "@/lib/storage"
import { generateDays, getTodayId } from "@/lib/weeks"
import { FavoriteTeam, Game } from "@/types"

const SPORT_LABELS: Record<Sport, string> = {
  nfl: "NFL",
  ncaaf: "NCAA Football",
  ncaab: "NCAA Basketball",
}

function getSportFromGame(game: Game): Sport {
  if (game.api_uri.includes("nfl")) return "nfl"
  if (game.api_uri.includes("ncaaf")) return "ncaaf"
  if (game.api_uri.includes("ncaab")) return "ncaab"
  return "nfl"
}

type SectionData = {
  sport: Sport | "favorites"
  title: string
  data: Game[]
}

export function AllSportsView() {
  const isDark = useColorScheme() === "dark"
  const navigation = useNavigation()
  const scheduleSheetRef = useRef<TrueSheet>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [favoriteTeams] =
    useMMKVObject<FavoriteTeam[]>(FAVORITES_KEY, storage) ?? []

  const [todayId, setTodayId] = useState(getTodayId)
  const days = useMemo(() => generateDays(), [todayId])
  const [selectedDayId, setSelectedDayId] = useState(getTodayId)

  // Update today's date when app comes back from background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        const newTodayId = getTodayId()
        if (newTodayId !== todayId) {
          setTodayId(newTodayId)
          setSelectedDayId(newTodayId)
        }
      }
    })
    return () => subscription.remove()
  }, [todayId])

  const selectedDay = useMemo(
    () => days.find((d) => d.id === selectedDayId) ?? days[0],
    [days, selectedDayId],
  )

  const { data: games, refetch, isLoading } = useAllSportsGames(selectedDay.date)

  const favoriteTeamIds = useMemo(
    () => new Set(favoriteTeams?.map((t) => t.id) ?? []),
    [favoriteTeams],
  )

  const sections: SectionData[] = useMemo(() => {
    if (!games) return []

    const allGames = SPORTS.flatMap((sport) =>
      games[sport].map((game) => ({ game, sport })),
    )

    const favoriteGames: { game: Game; sport: Sport }[] = []
    const remainingBySport: Record<Sport, Game[]> = {
      nfl: [],
      ncaaf: [],
      ncaab: [],
    }

    for (const { game, sport } of allGames) {
      const isFavorite =
        favoriteTeamIds.has(game.home_team.id) ||
        favoriteTeamIds.has(game.away_team.id)
      if (isFavorite) {
        favoriteGames.push({ game, sport })
      } else {
        remainingBySport[sport].push(game)
      }
    }

    const result: SectionData[] = []

    if (favoriteGames.length > 0) {
      result.push({
        sport: "favorites",
        title: "Favorites",
        data: favoriteGames.map((fg) => fg.game),
      })
    }

    for (const sport of SPORTS) {
      if (remainingBySport[sport].length > 0) {
        result.push({
          sport,
          title: SPORT_LABELS[sport],
          data: remainingBySport[sport],
        })
      }
    }

    return result
  }, [games, favoriteTeamIds])

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

  if (isLoading) {
    return (
      <View className="flex-1 p-2 px-4">
        <View className="mt-6 mb-2">
          <SkeletonLine width="w-24" height="h-6" />
        </View>
        <GameListSkeleton count={4} />
        <View className="mt-6 mb-2">
          <SkeletonLine width="w-32" height="h-6" />
        </View>
        <GameListSkeleton count={3} />
      </View>
    )
  }

  return (
    <GestureDetector gesture={changeScheduleGesture}>
      <View className="flex-1 p-2 px-4">
        {sections.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-lg font-bold text-center mb-2">
              No games scheduled
            </Text>
            <Text className="text-center text-zinc-500 dark:text-zinc-400">
              No tracked games {selectedDay.id === getTodayId() ? "today" : `on ${selectedDay.label}`}{" "}
              (NFL and NCAA Power 4 games)
            </Text>
          </View>
        ) : (
        <SectionList
          sections={sections}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          onRefresh={async () => {
            setIsRefreshing(true)
            await refetch()
            setIsRefreshing(false)
          }}
          refreshing={isRefreshing}
          keyExtractor={(item) => `${item.id}-${selectedDayId}`}
          renderSectionHeader={({ section }) => (
            <View className="mb-2 mt-6 flex-row items-center gap-2">
              <Text className="text-lg font-bold">{section.title}</Text>
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View
              className="border-zinc-200 dark:border-zinc-700"
              style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
            />
          )}
          renderItem={({ item, section }) => {
            const sport =
              section.sport === "favorites"
                ? getSportFromGame(item)
                : section.sport
            return (
              <View
                className={`relative flex flex-col gap-2 ${item.status === "in_progress" ? "active" : ""}`}
              >
                <GamePreview game={item} sport={sport} />
              </View>
            )
          }}
        />
        )}

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
