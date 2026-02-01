import React from "react"
import { Pressable, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { API_URL } from "@/lib/hooks"
import { Game } from "@/types"
import TeamLine from "./team-line"
import { Text } from "./text"

export function GamePreview({
  game,
  sport,
  disabled = false,
}: {
  game: Game
  sport: "ncaaf" | "ncaab" | "nfl"
  disabled?: boolean
}) {
  let navigation = useNavigation()
  let { data: gameDetails } = useQuery({
    queryKey: ["game", String(game.id)],
    staleTime: 1000 * 60,
    queryFn: async () => {
      let res = await fetch(`${API_URL}/${sport}/events/${game.id}`)
      if (!res.ok) throw new Error(await res.text())
      return { game: (await res.json()) as Game }
    },
  })
  let cachedGame = gameDetails?.game ?? game

  function renderGameStatus() {
    if (game.status !== "pre_game") {
      return (
        <Text className="text-lg text-right">
          {game.box_score?.progress.string}
        </Text>
      )
    } else {
      let gameTime = new Date(game.game_date).toLocaleTimeString(undefined, {
        timeStyle: "short",
      })
      return <Text className="text-lg text-right">{gameTime}</Text>
    }
  }

  function renderChannel() {
    let channel = cachedGame.tv_listings_by_country_code?.us?.[0]?.long_name
    if (game.status === "pre_game" && channel) {
      return <Text className="text-sm text-right">{channel}</Text>
    }
    return <></>
  }

  return (
    <Pressable
      className="text-lg active flex flex-row items-center gap-2 py-4"
      disabled={disabled}
      onPress={() => {
        if (sport !== "nfl" && sport !== "ncaab" && sport !== "ncaaf") {
          throw new Error(`invalid route name: ${sport}`)
        }
        navigation.navigate("details", {
          sport,
          id: String(game.id),
        })
      }}
    >
      {game.status === "in_progress" && (
        <View className="w-3 h-3 rounded-full bg-emerald-500" />
      )}
      <View className="flex flex-row gap-2 items-start flex-shrink">
        <View className="flex flex-col flex-1 gap-1">
          <TeamLine
            team={game.away_team}
            type="away"
            game={game}
            renderStatus={renderGameStatus}
          />
          <TeamLine
            team={game.home_team}
            type="home"
            game={game}
            renderStatus={renderChannel}
          />
        </View>
      </View>
    </Pressable>
  )
}
