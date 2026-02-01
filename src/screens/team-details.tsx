import React, { useState } from "react"
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import * as Haptics from "expo-haptics"
import { SymbolView } from "expo-symbols"
import { useNavigation } from "@react-navigation/native"
import { useMMKVObject } from "react-native-mmkv"
import colors from "tailwindcss/colors"
import { TeamDetailsSkeleton } from "@/components/game-details-skeleton"
import { Text } from "@/components/text"
import { useTeamSchedule, useTeamStanding } from "@/lib/hooks"
import { FAVORITES_KEY, storage } from "@/lib/storage"
import { FavoriteTeam, Game, Team } from "@/types"
import { RootStackScreenProps } from "./types"

type Props = RootStackScreenProps<"team">

export function TeamDetail({ route }: Props) {
  let navigation = useNavigation()
  let [isRefetching, setIsRefetching] = useState(false)
  let [favoriteTeams, setFavoriteTeams] = useMMKVObject<FavoriteTeam[]>(
    FAVORITES_KEY,
    storage,
  ) ?? [[], () => {}]
  let {
    data: games,
    status,
    error,
    refetch,
  } = useTeamSchedule(route.params.sport, route.params.teamId)
  let { data: standing } = useTeamStanding(
    route.params.sport,
    route.params.teamId,
  )

  const isFavorite = (favoriteTeams ?? []).some(
    (t) => t.id === route.params.teamId,
  )

  // Filter, sort games, and calculate conference record
  const allGames = games
    ? games
        .filter((g) => g.home_team && g.away_team)
        .sort(
          (a, b) =>
            new Date(a.game_date).getTime() - new Date(b.game_date).getTime(),
        )
    : []



  if (status === "pending") {
    return <TeamDetailsSkeleton />
  }

  if (status === "error") {
    return <Text>{error?.message}</Text>
  }

  if (!games || games.length === 0) {
    return <Text>No games found</Text>
  }

  const firstGame = games.find(
    (g) =>
      g.home_team?.id === route.params.teamId ||
      g.away_team?.id === route.params.teamId,
  )

  if (!firstGame) {
    return <Text>Team data not found</Text>
  }

  const team =
    firstGame.home_team?.id === route.params.teamId
      ? firstGame.home_team
      : firstGame.away_team

  const handleFavoriteToggle = () => {
    const current = favoriteTeams ?? []
    if (isFavorite) {
      setFavoriteTeams(current.filter((t) => t.id !== route.params.teamId))
    } else {
      setFavoriteTeams([...current, { ...team, sport: route.params.sport }])
    }
  }

  const handleRefresh = async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }

  return (
    <ScrollView
      className="flex-1 px-4 py-4"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
    >
      <View className="items-center gap-3 mb-6">
        <Image
          source={{ uri: team.logos.large || team.logos.small }}
          className="w-24 h-24"
          accessibilityLabel={`${team.name} logo`}
        />
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl font-bold">{team.full_name}</Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              handleFavoriteToggle()
            }}
          >
            <SymbolView
              name={isFavorite ? "star.fill" : "star"}
              size={24}
              tintColor={isFavorite ? colors.yellow[400] : colors.zinc[400]}
            />
          </Pressable>
        </View>
        {standing && (
          <View className="items-center">
            <Text className="text-xl">
              {standing.short_record}
              {standing.short_conference_record &&
                ` (${standing.short_conference_record})`}
            </Text>
            <Text className="text-sm">
              {standing.division ?? standing.conference}
            </Text>
          </View>
        )}
      </View>

      {allGames.length > 0 && (
        <View className="mb-12">
          {allGames.map((game) => (
            <GameRow
              key={game.id}
              game={game}
              teamId={route.params.teamId}
              sport={route.params.sport}
            />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

function GameRow({
  game,
  teamId,
  sport,
}: {
  game: Game
  teamId: number
  sport: "ncaaf" | "nfl" | "ncaab"
}) {
  let navigation = useNavigation()

  if (!game.home_team || !game.away_team) {
    return null
  }

  const isTeamHome = game.home_team.id === teamId
  const opponent = isTeamHome ? game.away_team : game.home_team
  const teamScore = isTeamHome
    ? game.box_score?.score?.home?.score
    : game.box_score?.score?.away?.score
  const opponentScore = isTeamHome
    ? game.box_score?.score?.away?.score
    : game.box_score?.score?.home?.score

  const isCompleted = game.status !== "pre_game" && teamScore !== undefined
  const isWin = isCompleted && teamScore > opponentScore
  const isLoss = isCompleted && teamScore < opponentScore

  const gameDateStr = new Date(game.game_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("details", {
          sport,
          id: String(game.id),
        })
      }
    >
      <View
        className="flex-row items-center justify-between py-3 px-3"
        style={{
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: colors.zinc[500],
        }}
      >
        <View className="flex-1">
          <Text className="text-sm">{gameDateStr}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-xs text-zinc-400 mr-1">
              {isTeamHome ? "vs" : "@"}
            </Text>
            <View className="flex-row items-center gap-1">
              <Image source={{ uri: opponent.logos.small }} className="w-8 h-8" />
              <Text className="flex-1">{opponent.name}</Text>
            </View>
          </View>
        </View>
        {isCompleted ? (
          <View className="flex-row gap-2 items-center">
            <Text className="font-bold">
              {isWin ? "W" : isLoss ? "L" : "T"}
            </Text>
            <Text>
              {teamScore} - {opponentScore}
            </Text>
          </View>
        ) : (
          <Text>
            {new Date(game.game_date).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}
