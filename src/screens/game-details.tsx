import React, { useEffect, useState } from "react"
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  useColorScheme,
  View,
} from "react-native"
import { openURL } from "expo-linking"
import { SymbolView } from "expo-symbols"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { useNavigation } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import colors from "tailwindcss/colors"
import { BasketballBoxScore } from "@/components/basketball-box-score"
import { BasketballScore } from "@/components/basketball-score"
import { FootballBoxScore } from "@/components/football-box-score"
import { FootballScore } from "@/components/football-score"
import {
  GameDetailsSkeleton,
  PlaysListSkeleton,
} from "@/components/game-details-skeleton"
import { PlayByPlayList } from "@/components/play-by-play-list"
import { Text } from "@/components/text"
import { API_URL } from "@/lib/hooks"
import { useGameLiveActivity } from "@/lib/useGameLiveActivity"
import {
  BasketballPlayerRecord,
  BasketballTeamRecord,
  FootballPlayerRecord,
  Game,
  NcaaBBEvent,
  NcaaFBEvent,
  NFLEvent,
  PlayRecord,
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

type TabType = "game" | "plays"

export function GameDetails({ route }: Props) {
  let navigation = useNavigation()
  let isDark = useColorScheme() === "dark"
  let [activeTab, setActiveTab] = useState<TabType>("game")
  let [isRefetching, setIsRefetching] = useState(false)
  let {
    data: gameQuery,
    status,
    error,
    refetch,
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

  let { isTracking, startTracking, stopTracking } = useGameLiveActivity(
    gameQuery?.game,
  )
  let { data: boxScore, refetch: refetchBoxScore } = useQuery({
    queryKey: ["boxScore", gameQuery?.game?.box_score?.id],
    enabled: gameQuery?.game.status !== "pre_game",
    refetchInterval: 5000,
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

  let { data: teamRecords, refetch: refetchTeamRecords } = useQuery({
    queryKey: ["teamRecords", gameQuery?.game?.box_score?.id],
    enabled:
      !!gameQuery?.game &&
      gameQuery.game.status !== "pre_game" &&
      isBasketballEvent(gameQuery.game),
    refetchInterval: 5000,
    queryFn: async () => {
      if (!gameQuery?.game.box_score.id) return null
      let res = await fetch(
        `${API_URL}/${route.params.sport}/box_scores/${gameQuery?.game.box_score.id}`,
      )
      if (!res.ok) return null
      let data: {
        team_records: { home: BasketballTeamRecord; away: BasketballTeamRecord }
      } = await res.json()
      return data.team_records
    },
  })

  let { data: standings, refetch: refetchStandings } = useQuery({
    queryKey: [
      "standings",
      route.params.sport,
      gameQuery?.game.home_team.id,
      gameQuery?.game.away_team.id,
    ],
    enabled: gameQuery?.game.status === "pre_game",
    queryFn: async () => {
      type StandingRecord = {
        short_record: string
        short_home_record?: string
        short_away_record?: string
      }
      let [homeRes, awayRes] = await Promise.all([
        fetch(
          `${API_URL}/${route.params.sport}/standings?team_id=${gameQuery?.game.home_team.id}`,
        ),
        fetch(
          `${API_URL}/${route.params.sport}/standings?team_id=${gameQuery?.game.away_team.id}`,
        ),
      ])
      let homeStandings: StandingRecord[] | null = homeRes.ok
        ? await homeRes.json()
        : null
      let awayStandings: StandingRecord[] | null = awayRes.ok
        ? await awayRes.json()
        : null
      let home = homeStandings?.[0] ?? null
      let away = awayStandings?.[0] ?? null
      return {
        home: {
          record: home?.short_record ?? null,
          homeRecord: home?.short_home_record ?? null,
          awayRecord: home?.short_away_record ?? null,
        },
        away: {
          record: away?.short_record ?? null,
          homeRecord: away?.short_home_record ?? null,
          awayRecord: away?.short_away_record ?? null,
        },
      }
    },
  })

  let {
    data: plays,
    isLoading: playsLoading,
    refetch: refetchPlays,
  } = useQuery({
    queryKey: ["plays", route.params.id],
    enabled:
      activeTab === "plays" &&
      gameQuery?.game.status !== "pre_game" &&
      gameQuery?.game.has_play_by_play_records === true,
    refetchInterval: activeTab === "plays" ? 10000 : false,
    queryFn: async () => {
      let res = await fetch(
        `${API_URL}/${route.params.sport}/events/${route.params.id}/play_by_play_records`,
      )
      if (!res.ok) {
        throw new Error(await res.text())
      }
      return (await res.json()) as PlayRecord[]
    },
  })

  useEffect(() => {
    if (gameQuery?.game) {
      navigation?.setOptions({
        headerTitle: `${gameQuery.game.away_team.abbreviation} @ ${gameQuery.game.home_team.abbreviation}`,
        headerRight: () =>
          // gameQuery.game.status === "in_progress" ? (
          true ? (
            <Pressable
              onPress={isTracking ? stopTracking : startTracking}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 active:opacity-70"
            >
              <SymbolView
                name={isTracking ? "stop.fill" : "play.fill"}
                size={10}
                tintColor={isDark ? "#fff" : "#000"}
              />
              <Text className="text-sm font-medium">
                {isTracking ? "Stop Tracking" : "Track Live"}
              </Text>
            </Pressable>
          ) : null,
      })
    }
  }, [gameQuery?.game, isTracking])

  if (status === "pending") {
    return <GameDetailsSkeleton />
  }

  if (status === "error") {
    return <Text>{error?.message}</Text>
  }

  if (!gameQuery) {
    return <Text>nothing here</Text>
  }

  const handleRefresh = async () => {
    setIsRefetching(true)
    await Promise.all([
      refetch(),
      refetchBoxScore(),
      refetchTeamRecords(),
      refetchStandings(),
      refetchPlays(),
    ])
    setIsRefetching(false)
  }

  return (
    <ScrollView
      className="px-4 py-4"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
      }
    >
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
            <Pressable
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
            </Pressable>
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

        {gameQuery.game.status !== "pre_game" &&
          gameQuery.game.box_score?.last_play &&
          (gameQuery.game.box_score.last_play.description ||
            ("details" in gameQuery.game.box_score.last_play &&
              gameQuery.game.box_score.last_play.details)) && (
            <View className="w-full mt-4">
              <Text className="text-xl">Last Play</Text>
              <Text className="mt-2">
                {gameQuery.game.box_score.last_play.description ||
                  ("details" in gameQuery.game.box_score.last_play &&
                    gameQuery.game.box_score.last_play.details)}
              </Text>
            </View>
          )}

        {gameQuery.game.status !== "pre_game" &&
          gameQuery.game.has_play_by_play_records && (
            <View className="w-full mt-2">
              <SegmentedControl
                values={["Game", "Plays"]}
                selectedIndex={activeTab === "game" ? 0 : 1}
                onValueChange={(value) =>
                  setActiveTab(value === "Game" ? "game" : "plays")
                }
                tintColor={isDark ? colors.zinc[700] : colors.white}
                backgroundColor={isDark ? colors.zinc[800] : colors.zinc[100]}
                fontStyle={{
                  color: isDark ? colors.zinc[400] : colors.zinc[500],
                }}
                activeFontStyle={{
                  color: isDark ? colors.white : colors.black,
                }}
              />
            </View>
          )}

        {gameQuery.game.status === "pre_game" && (
          <View className="w-full mt-8 gap-6">
            <View className="flex-row justify-around">
              {gameQuery.game.odd?.line && (
                <View className="items-center flex-1">
                  <Text className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide mb-1">
                    Spread
                  </Text>
                  <Text className="text-xl font-semibold">
                    {gameQuery.game.odd.line}
                  </Text>
                </View>
              )}
              {gameQuery.game.odd?.over_under && (
                <View className="items-center flex-1">
                  <Text className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide mb-1">
                    O/U
                  </Text>
                  <Text className="text-xl font-semibold">
                    {gameQuery.game.odd.over_under}
                  </Text>
                </View>
              )}
              {standings?.away?.awayRecord && (
                <View className="items-center flex-1">
                  <Text className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide mb-1">
                    {gameQuery.game.away_team.abbreviation} Away
                  </Text>
                  <Text className="text-xl font-semibold">
                    {standings.away.awayRecord}
                  </Text>
                </View>
              )}
              {standings?.home?.homeRecord && (
                <View className="items-center flex-1">
                  <Text className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide mb-1">
                    {gameQuery.game.home_team.abbreviation} Home
                  </Text>
                  <Text className="text-xl font-semibold">
                    {standings.home.homeRecord}
                  </Text>
                </View>
              )}
            </View>
            {(("stadium" in gameQuery.game && gameQuery.game.stadium) ||
              gameQuery.game.location) && (
              <View className="items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Text className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wide mb-1">
                  Venue
                </Text>
                <Text className="text-center font-medium">
                  {"stadium" in gameQuery.game && gameQuery.game.stadium
                    ? gameQuery.game.stadium
                    : gameQuery.game.location}
                </Text>
                {"stadium" in gameQuery.game &&
                  gameQuery.game.stadium &&
                  gameQuery.game.location && (
                    <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                      {gameQuery.game.location}
                    </Text>
                  )}
              </View>
            )}
          </View>
        )}
      </View>

      {activeTab === "game" && (
        <>
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
        </>
      )}

      {activeTab === "plays" && (
        <View className="pb-12">
          {playsLoading ? (
            <PlaysListSkeleton />
          ) : plays && plays.length > 0 ? (
            <PlayByPlayList
              plays={plays}
              game={gameQuery.game}
              isBasketball={isBasketballEvent(gameQuery.game)}
            />
          ) : (
            <Text className="text-center text-zinc-500 dark:text-zinc-400 mt-8">
              No plays available yet
            </Text>
          )}
        </View>
      )}
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
    <Pressable
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
    </Pressable>
  )
}

function isFootballEvent(game: Game): game is NcaaFBEvent | NFLEvent {
  return game.api_uri.includes("nfl") || game.api_uri.includes("ncaaf")
}

function isBasketballEvent(game: Game): game is NcaaBBEvent {
  return game.api_uri.includes("ncaab")
}
