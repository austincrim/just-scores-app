import React from "react"
import { Image, ScrollView, Text, View } from "react-native"
import { useQuery } from "@tanstack/react-query"
import { BasketballScore } from "@/components/basketball-score"
import { FootballScore } from "@/components/football-score"
import { API_URL } from "@/lib/hooks"
import {
  Game,
  NcaaBBEvent,
  NcaaBBEventStats,
  NcaaFBEvent,
  NFLEvent,
} from "@/types"
import { RootStackScreenProps } from "./types"

type Props = RootStackScreenProps<"GameDetails">
export function GameDetails({ route }: Props) {
  let { data, status, error } = useQuery({
    queryKey: ["game", route.params.id],
    refetchInterval: 5000,
    queryFn: async () => {
      let res = await fetch(
        `${API_URL}/${route.params.sport}/events/${route.params.id}`,
      )

      if (!res.ok) {
        throw new Error(await res.text())
      }
      let game: NcaaBBEvent | NcaaFBEvent | NFLEvent = await res.json()

      let statsRes = await fetch(`${API_URL}${game.api_uri}`)
      if (!statsRes.ok) console.error(await statsRes.text())
      let stats: NcaaBBEventStats | NcaaFBEvent | NFLEvent =
        await statsRes.json()

      return {
        game,
        stats,
      }
    },
  })

  if (status === "pending") {
    return <Text>loading...</Text>
  }

  if (status === "error") {
    return <Text>{error?.message}</Text>
  }

  if (!data) {
    return <Text>nothing here</Text>
  }

  return (
    <ScrollView className="px-4 py-4">
      <View className="flex items-center gap-4">
        <View className="flex self-start flex-row justify-between w-full items-center gap-2">
          {data.game.status !== "pre_game" ? (
            <Text className="text-2xl tabular-nums min-w-fit">
              {data.game.box_score.progress.string}
            </Text>
          ) : (
            <Text className="whitespace-nowrap">
              {new Date(data.game.game_date).toLocaleTimeString(undefined, {
                timeStyle: "short",
              })}
            </Text>
          )}
          {data.game.tv_listings_by_country_code?.us && (
            <Text className="text-center">
              {data.game.tv_listings_by_country_code.us[0].long_name}
            </Text>
          )}
        </View>
        <View className="flex flex-col w-full gap-2">
          <TeamLine game={data.game} type="away" />
          <TeamLine game={data.game} type="home" />
        </View>
      </View>
      <View>
        {isFootballEvent(data.game) && <FootballScore game={data.game} />}
        {isBasketballEvent(data.game) && (
          <BasketballScore
            game={data.game}
            stats={data.stats as NcaaBBEventStats}
          />
        )}
      </View>
    </ScrollView>
  )
}

function TeamLine({ game, type }: { game: Game; type: "away" | "home" }) {
  let team = type === "home" ? game.home_team : game.away_team
  let score =
    type === "home"
      ? game.box_score?.score?.home?.score
      : game.box_score?.score?.away?.score
  let ranking = type === "home" ? game.home_ranking : game.away_ranking

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center justify-between gap-2 font-semibold">
        <Image
          source={{ uri: team.logos.small }}
          className="object-cover w-20 h-20"
          accessibilityLabel={`${team.name} logo`}
        />
        {ranking && <Text className="text-lg">{ranking}</Text>}
        <Text
          className={`text-2xl font-bold ${
            isFootballEvent(game) &&
            game.box_score?.team_in_possession?.name === team.name
              ? "text-amber-700"
              : ""
          }`}
        >
          {team.name}
        </Text>
      </View>
      <Text className="text-5xl tabular-nums">{score}</Text>
    </View>
  )
}

function isFootballEvent(game: Game): game is NcaaFBEvent | NFLEvent {
  return game.api_uri.includes("nfl") || game.api_uri.includes("ncaaf")
}

function isBasketballEvent(game: Game): game is NcaaBBEvent {
  return game.api_uri.includes("ncaab")
}
