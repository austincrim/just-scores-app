import React from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { openURL } from "expo-linking"
import { SymbolView } from "expo-symbols"
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

// box score api https://api.thescore.com/ncaaf/box_scores/game_id/player_records

const channelIds = new Map([
  ["espn", "GWQUdCwWPJU"],
  ["espn2", "58wFNK6wHiE"],
  ["espnu", "qOY_wLN3Cws"],
  ["fox", "Zb93jUWQ02I"],
  ["btn", "dK6q3BY5Cho"],
  ["fs1", "_Cg4OXROht0"],
  ["fs2", "dOebiFJpesk"],
  ["abc", "oq8VLH9APU4"],
  ["cbs", "H8IaNgT3Ppg"],
  ["sec network", "8_6sI1qMNEo"],
  ["acc network", "vPQQzD4ZBec"],
  ["cbs sports network", "2rzCpZXNzBw"],
  ["the cw", "sn3_WG30_vA"],
])

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
            <Text className="text-2xl tabular-nums min-w-fit">
              {new Date(data.game.game_date).toLocaleTimeString(undefined, {
                timeStyle: "short",
              })}
            </Text>
          )}
          {data.game.tv_listings_by_country_code?.us && (
            <TouchableOpacity
              onPress={async () => {
                try {
                  await openURL(
                    `youtubetv://${channelIds.get(data.game.tv_listings_by_country_code.us[0].long_name.toLowerCase())}`,
                  )
                } catch (e) {
                  console.error(e)
                }
              }}
              className="text-center"
            >
              <View className="flex flex-row items-center gap-1">
                <SymbolView name="tv" size={16} resizeMode="scaleAspectFit" />
                <Text>
                  {data.game.tv_listings_by_country_code.us[0].long_name}
                </Text>
              </View>
            </TouchableOpacity>
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
  let hasPossession =
    isFootballEvent(game) &&
    game.box_score?.team_in_possession?.name === team.name

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center justify-between gap-2 font-semibold">
        <Image
          source={{ uri: team.logos.small }}
          className="object-cover w-20 h-20"
          accessibilityLabel={`${team.name} logo`}
        />
        {ranking && <Text className="text-lg">{ranking}</Text>}
        <View className="flex flex-row items-center gap-1">
          <Text
            className={`text-2xl font-bold ${
              hasPossession ? "text-amber-800" : ""
            }`}
          >
            {team.name}
          </Text>
          {hasPossession && (
            <SymbolView
              name="football.fill"
              size={20}
              tintColor="#92400e"
              style={{ transform: "rotate(45deg)" }}
            />
          )}
        </View>
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
