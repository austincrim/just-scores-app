import React, { useEffect } from "react"
import { Image, ScrollView, TouchableOpacity, View } from "react-native"
import { openURL } from "expo-linking"
import { SymbolView } from "expo-symbols"
import { useNavigation } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { BasketballBoxScore } from "@/components/basketball-box-score"
import { BasketballScore } from "@/components/basketball-score"
import { FootballBoxScore } from "@/components/football-box-score"
import { FootballScore } from "@/components/football-score"
import { Text } from "@/components/text"
import { API_URL } from "@/lib/hooks"
import {
  BasketballPlayerRecord,
  FootballPlayerRecord,
  Game,
  NcaaBBEvent,
  NcaaBBEventStats,
  NcaaFBEvent,
  NFLEvent,
  BasketballBoxScore as TBasketballBoxScore,
  FootballBoxScore as TFootballBoxScore,
} from "@/types"
import { RootStackScreenProps } from "./types"

// box score api https://api.thescore.com/ncaaf/box_scores/game_id/player_records

const channelIds = new Map([
  ["espn", "youtubetv://GWQUdCwWPJU"],
  ["espn2", "youtubetv://58wFNK6wHiE"],
  ["espnu", "youtubetv://qOY_wLN3Cws"],
  ["fox", "youtubetv://Zb93jUWQ02I"],
  ["btn", "youtubetv://dK6q3BY5Cho"],
  ["fox sports 1", "youtubetv://_Cg4OXROht0"],
  ["fox sports 2", "youtubetv://dOebiFJpesk"],
  ["abc", "youtubetv://oq8VLH9APU4"],
  ["cbs", "youtubetv://H8IaNgT3Ppg"],
  ["nfl network", "youtubetv://ZpAfRye3sBw"],
  ["sec network", "youtubetv://8_6sI1qMNEo"],
  ["acc network", "youtubetv://vPQQzD4ZBec"],
  ["cbs sports network", "youtubetv://2rzCpZXNzBw"],
  ["the cw", "youtubetv://sn3_WG30_vA"],
  ["espn+", "https://espn.com/watch"],
  ["peacock", "peacock://"],
])

type Props = RootStackScreenProps<"details">

export function GameDetails({ route }: Props) {
  let navigation = useNavigation()
  let {
    data: gameQuery,
    status,
    error,
  } = useQuery({
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

      return { game, stats }
    },
  })
  let { data: boxScore } = useQuery({
    queryKey: ["boxScore", gameQuery?.game?.box_score?.id],
    enabled: gameQuery?.game.status !== "pre_game",
    queryFn: async () => {
      if (!gameQuery?.game.box_score.id) return []
      let res = await fetch(
        `${API_URL}/${route.params.sport}/box_scores/${gameQuery?.game.box_score.id}/player_records`,
      )

      if (!res.ok) {
        throw new Error(await res.text())
      }
      let boxScore: (FootballPlayerRecord | BasketballPlayerRecord)[] =
        await res.json()

      return boxScore
    },
    select: (data) => {
      const homeTeam: (FootballPlayerRecord | BasketballPlayerRecord)[] = []
      const awayTeam: (FootballPlayerRecord | BasketballPlayerRecord)[] = []

      data.forEach((player) => {
        if (player.alignment === "home") {
          homeTeam.push(player)
        } else if (player.alignment === "away") {
          awayTeam.push(player)
        }
      })

      return { home: homeTeam, away: awayTeam }
    },
  })

  useEffect(() => {
    if (gameQuery?.game) {
      navigation?.setOptions({
        headerTitle: `${gameQuery.game.away_team.abbreviation} @ ${gameQuery.game.home_team.abbreviation}`,
      })
    }
  }, [gameQuery?.game])

  if (status === "pending") {
    return <Text>loading...</Text>
  }

  if (status === "error") {
    return <Text>{error?.message}</Text>
  }

  if (!gameQuery) {
    return <Text>nothing here</Text>
  }

  return (
    <ScrollView className="px-4 py-4">
      <View className="flex items-center gap-4">
        <View className="flex self-start flex-row justify-between w-full items-center gap-2">
          {gameQuery.game.status !== "pre_game" ? (
            <Text className="text-xl tabular-nums min-w-fit">
              {gameQuery.game.box_score.progress.string}
            </Text>
          ) : (
            <Text className="text-xl tabular-nums min-w-fit">
              {new Date(gameQuery.game.game_date).toLocaleTimeString(
                undefined,
                { timeStyle: "short" },
              )}
            </Text>
          )}
          {gameQuery.game.tv_listings_by_country_code?.us && (
            <TouchableOpacity
              className="text-center"
              onPress={async () => {
                try {
                  await openURL(
                    channelIds.get(
                      gameQuery.game.tv_listings_by_country_code.us[0].long_name.toLowerCase(),
                    )!,
                  )
                } catch (e) {
                  console.error(e)
                }
              }}
            >
              <View className="flex flex-row items-center gap-1">
                <SymbolView name="tv" size={16} resizeMode="scaleAspectFit" />
                <Text>
                  {gameQuery.game.tv_listings_by_country_code.us[0].long_name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex flex-col w-full gap-2">
          <TeamLine game={gameQuery.game} type="away" />
          <TeamLine game={gameQuery.game} type="home" />
        </View>
      </View>
      <View>
        {isFootballEvent(gameQuery.game) && (
          <FootballScore game={gameQuery.game} />
        )}
        {isBasketballEvent(gameQuery.game) && (
          <BasketballScore
            game={gameQuery.game}
            stats={gameQuery.stats as NcaaBBEventStats}
          />
        )}
      </View>
      <View className="pb-12">
        {isFootballEvent(gameQuery.game) &&
          boxScore &&
          gameQuery.game.status !== "pre_game" && (
            <FootballBoxScore
              boxScore={boxScore as TFootballBoxScore}
              game={gameQuery.game}
            />
          )}
        {isBasketballEvent(gameQuery.game) &&
          boxScore &&
          gameQuery.game.status !== "pre_game" && (
            <View className="mt-8">
              <BasketballBoxScore
                boxScore={boxScore as TBasketballBoxScore}
                game={gameQuery.game}
              />
            </View>
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
