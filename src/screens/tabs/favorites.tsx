import { Image, RefreshControl, ScrollView, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { format, isToday, isTomorrow } from "date-fns"
import { useState } from "react"
import { useMMKVObject } from "react-native-mmkv"
import { GamePreview } from "@/components/game-preview"
import { Text } from "@/components/text"
import { useFavoriteTeamSchedules } from "@/lib/hooks"
import { FAVORITES_KEY, storage } from "@/lib/storage"
import { FavoriteTeam, Game } from "@/types"
import { TabScreenProps } from "../types"

type Props = TabScreenProps<"favorites">

export function Favorites({}: Props) {
  let navigation = useNavigation()
  let [isRefetching, setIsRefetching] = useState(false)
  let [favoriteTeams] = useMMKVObject<FavoriteTeam[]>(FAVORITES_KEY, storage) ?? [[]]

  let { games, refetch } = useFavoriteTeamSchedules(favoriteTeams ?? [])

  if (!favoriteTeams || favoriteTeams.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-lg font-semibold mb-2">
          No Favorite Teams Yet
        </Text>
        <Text className="text-center text-sm">
          Go to a team's page and tap the star icon to add them to your
          favorites. You'll see all their upcoming games here.
        </Text>
      </View>
    )
  }

  const favoriteTeamIds = new Set(favoriteTeams?.map((t) => t.id) ?? [])

  const handleRefresh = async () => {
    setIsRefetching(true)
    await refetch()
    setIsRefetching(false)
  }

  return (
    <ScrollView
      className="flex-1 px-2 py-4"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
    >
      <View className="mb-4">
        <View className="flex-row flex-wrap gap-2">
          {favoriteTeams.map((team) => (
            <TouchableOpacity
              key={team.id}
              onPress={() =>
                navigation.navigate("team", {
                  teamId: team.id,
                  sport: team.sport,
                  teamName: team.name,
                })
              }
              className="items-center gap-1 p-2 border border-zinc-400 dark:border-zinc-700 rounded-md"
            >
              <Image
                source={{ uri: team.logos.w72xh72 }}
                className="w-10 h-10"
              />
              <Text className="text-xs text-center">{team.abbreviation}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {games.length > 0 ? (
        <View className="px-3">
          {games.map((game, index) => {
            const sport = detectSport(game)
            const isFavoriteTeamPlaying =
              favoriteTeamIds.has(game.home_team?.id) ||
              favoriteTeamIds.has(game.away_team?.id)

            if (!isFavoriteTeamPlaying) return null

            const gameDate = new Date(game.game_date)
            const currentDateFormatted = gameDate.toLocaleDateString()
            const displayDate = isToday(gameDate)
              ? "Today"
              : isTomorrow(gameDate)
                ? "Tomorrow"
                : format(gameDate, "E · MMMM do")
            const previousGame = index > 0 ? games[index - 1] : null
            const previousGameDate = previousGame
              ? new Date(previousGame.game_date).toLocaleDateString()
              : null

            return (
              <View key={game.id} className="flex-1">
                {currentDateFormatted !== previousGameDate && (
                  <View>
                    <Text className="mt-4 font-bold">{displayDate}</Text>
                  </View>
                )}
                <GamePreview game={game} sport={sport} />
              </View>
            )
          })}
        </View>
      ) : (
        <Text className="text-center mt-4">
          No upcoming games in the next 7 days
        </Text>
      )}
    </ScrollView>
  )
}

function detectSport(game: Game): "nfl" | "ncaaf" | "ncaab" {
  if (game.api_uri.includes("nfl")) return "nfl"
  if (game.api_uri.includes("ncaaf")) return "ncaaf"
  if (game.api_uri.includes("ncaab")) return "ncaab"
  throw new Error(`unsupported sport ${game.api_uri}`)
}
