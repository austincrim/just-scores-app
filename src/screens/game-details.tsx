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
import { GameDetailsSkeleton } from "@/components/game-details-skeleton"
import { Text } from "@/components/text"
import { API_URL } from "@/lib/hooks"
import {
  BasketballPlayerRecord,
  BasketballTeamRecord,
  FootballPlayerRecord,
  Game,
  NcaaBBEvent,
  NcaaFBEvent,
  NFLEvent,
} from "@/types"
import { RootStackScreenProps } from "./types"

// box score api https://api.thescore.com/ncaaf/box_scores/game_id/player_records

const channelIds = new Map([
  ["espn", "https://tv.youtube.com/watch/GWQUdCwWPJU"],
  ["espn2", "https://tv.youtube.com/watch/58wFNK6wHiE"],
  ["espnu", "https://tv.youtube.com/watch/qOY_wLN3Cws"],
  ["fox", "https://tv.youtube.com/watch/Zb93jUWQ02I"],
  ["btn", "https://tv.youtube.com/watch/dK6q3BY5Cho"],
  ["fox sports 1", "https://tv.youtube.com/watch/_Cg4OXROht0"],
  ["fox sports 2", "https://tv.youtube.com/watch/dOebiFJpesk"],
  ["abc", "https://tv.youtube.com/watch/oq8VLH9APU4"],
  ["cbs", "https://tv.youtube.com/watch/H8IaNgT3Ppg"],
  ["nfl network", "https://tv.youtube.com/watch/ZpAfRye3sBw"],
  ["sec network", "https://tv.youtube.com/watch/8_6sI1qMNEo"],
  ["acc network", "https://tv.youtube.com/watch/vPQQzD4ZBec"],
  ["cbs sports network", "https://tv.youtube.com/watch/2rzCpZXNzBw"],
  ["the cw", "https://tv.youtube.com/watch/sn3_WG30_vA"],
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
      let game = (await res.json()) as Game

      return { game }
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

  let { data: teamRecords } = useQuery({
    queryKey: ["teamRecords", gameQuery?.game?.box_score?.id],
    enabled:
      !!gameQuery?.game &&
      gameQuery.game.status !== "pre_game" &&
      isBasketballEvent(gameQuery.game),
    queryFn: async () => {
      if (!gameQuery?.game.box_score.id) return null
      let res = await fetch(
        `${API_URL}/${route.params.sport}/box_scores/${gameQuery?.game.box_score.id}`,
      )
      if (!res.ok) return null
      let data: { team_records: { home: BasketballTeamRecord; away: BasketballTeamRecord } } =
        await res.json()
      return data.team_records
    },
  })

  let { data: standings } = useQuery({
    queryKey: [
      "standings",
      route.params.sport,
      gameQuery?.game.home_team.id,
      gameQuery?.game.away_team.id,
    ],
    enabled: gameQuery?.game.status === "pre_game",
    queryFn: async () => {
      type TeamStanding = {
        short_record: string
        short_home_record?: string
        short_away_record?: string
      }
      let [homeRes, awayRes] = await Promise.all([
        fetch(
          `${API_URL}/${route.params.sport}/teams/${gameQuery?.game.home_team.id}`,
        ),
        fetch(
          `${API_URL}/${route.params.sport}/teams/${gameQuery?.game.away_team.id}`,
        ),
      ])
      let home: { standing?: TeamStanding } | null = homeRes.ok
        ? await homeRes.json()
        : null
      let away: { standing?: TeamStanding } | null = awayRes.ok
        ? await awayRes.json()
        : null
      return {
        home: {
          record: home?.standing?.short_record ?? null,
          homeRecord: home?.standing?.short_home_record ?? null,
          awayRecord: home?.standing?.short_away_record ?? null,
        },
        away: {
          record: away?.standing?.short_record ?? null,
          homeRecord: away?.standing?.short_home_record ?? null,
          awayRecord: away?.standing?.short_away_record ?? null,
        },
      }
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
    return <GameDetailsSkeleton />
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
          {gameQuery.game.tv_listings_by_country_code?.us?.[0] && (
            <TouchableOpacity
              className="text-center"
              onPress={async () => {
                try {
                  await openURL(
                    channelIds.get(
                      gameQuery.game.tv_listings_by_country_code.us![0].long_name.toLowerCase(),
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
                  {gameQuery.game.tv_listings_by_country_code.us![0].long_name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex flex-col w-full gap-2">
          <TeamLine
            game={gameQuery.game}
            type="away"
            record={standings?.away?.record ?? undefined}
          />
          <TeamLine
            game={gameQuery.game}
            type="home"
            record={standings?.home?.record ?? undefined}
          />
        </View>
        {gameQuery.game.status === "pre_game" && (
          <View className="w-full mt-6 gap-4">
            {(gameQuery.game.odd?.line || gameQuery.game.odd?.over_under) && (
              <View className="flex-row mx-auto items-center gap-16 pb-4 border-b dark:border-zinc-700 border-zinc-300">
                {gameQuery.game.odd?.line && (
                  <View className="items-center">
                    <Text className="text-zinc-500 text-sm">Spread</Text>
                    <Text className="text-lg font-semibold">
                      {gameQuery.game.odd.line}
                    </Text>
                  </View>
                )}
                {gameQuery.game.odd?.over_under && (
                  <View className="items-center">
                    <Text className="text-zinc-500 text-sm">O/U</Text>
                    <Text className="text-lg font-semibold">
                      {gameQuery.game.odd.over_under}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {(standings?.away?.awayRecord || standings?.home?.homeRecord) && (
              <View className="flex-row mx-auto gap-16">
                {standings?.away?.awayRecord && (
                  <View className="items-center">
                    <Text className="text-zinc-500 text-sm">
                      {gameQuery.game.away_team.abbreviation} Away
                    </Text>
                    <Text className="text-lg font-semibold">
                      {standings.away.awayRecord}
                    </Text>
                  </View>
                )}
                {standings?.home?.homeRecord && (
                  <View className="items-center">
                    <Text className="text-zinc-500 text-sm">
                      {gameQuery.game.home_team.abbreviation} Home
                    </Text>
                    <Text className="text-lg font-semibold">
                      {standings.home.homeRecord}
                    </Text>
                  </View>
                )}
              </View>
            )}
            {(("stadium" in gameQuery.game && gameQuery.game.stadium) ||
              gameQuery.game.location) && (
              <View className="items-center border-t border-zinc-300 dark:border-zinc-700 pt-4">
                <Text className="text-center font-semibold">
                  {"stadium" in gameQuery.game && gameQuery.game.stadium
                    ? `${gameQuery.game.stadium}`
                    : gameQuery.game.location}
                </Text>
                {"stadium" in gameQuery.game && gameQuery.game.location && (
                  <Text className="text-zinc-500 text-sm">
                    {gameQuery.game.location}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </View>
      <View>
        {isFootballEvent(gameQuery.game) && (
          <FootballScore game={gameQuery.game} />
        )}
        {isBasketballEvent(gameQuery.game) && (
          <BasketballScore game={gameQuery.game} />
        )}
      </View>
      <View className="pb-12">
        {isFootballEvent(gameQuery.game) &&
          boxScore &&
          gameQuery.game.status !== "pre_game" && (
            <FootballBoxScore
              boxScore={
                boxScore as {
                  home: FootballPlayerRecord[]
                  away: FootballPlayerRecord[]
                }
              }
              game={gameQuery.game}
            />
          )}
        {isBasketballEvent(gameQuery.game) &&
          boxScore &&
          gameQuery.game.status !== "pre_game" && (
            <View className="mt-8">
              <BasketballBoxScore
                boxScore={
                  boxScore as {
                    home: BasketballPlayerRecord[]
                    away: BasketballPlayerRecord[]
                  }
                }
                game={gameQuery.game}
                teamRecords={teamRecords}
              />
            </View>
          )}
      </View>
    </ScrollView>
  )
}

function TeamLine({
  game,
  type,
  record,
}: {
  game: Game
  type: "away" | "home"
  record?: string
}) {
  let navigation = useNavigation()
  let team = type === "home" ? game.home_team : game.away_team
  let score =
    type === "home"
      ? game.box_score?.score?.home?.score
      : game.box_score?.score?.away?.score
  let ranking = type === "home" ? game.home_ranking : game.away_ranking
  let hasPossession =
    isFootballEvent(game) &&
    game.box_score?.team_in_possession?.name === team?.name
  let isPreGame = game.status === "pre_game"

  const sport = game.api_uri.includes("nfl")
    ? "nfl"
    : game.api_uri.includes("ncaaf")
      ? "ncaaf"
      : "ncaab"

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("team", {
          sport,
          teamId: team.id,
          teamName: team.name,
        })
      }
    >
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
        {isPreGame && record ? (
          <Text className="text-2xl text-zinc-500">{record}</Text>
        ) : (
          <Text className="text-5xl tabular-nums">{score}</Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

function isFootballEvent(game: Game): game is NcaaFBEvent | NFLEvent {
  return game.api_uri.includes("nfl") || game.api_uri.includes("ncaaf")
}

function isBasketballEvent(game: Game): game is NcaaBBEvent {
  return game.api_uri.includes("ncaab")
}
