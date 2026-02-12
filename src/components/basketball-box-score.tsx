import React, { useState } from "react"
import {
  FlatList,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { BasketballPlayerRecord, BasketballTeamRecord, Game } from "@/types"

const CELL_WIDTH = 50
const NAME_WIDTH = 100

const displayStats = [
  { key: "minutes", display: "MIN" },
  { key: "points", display: "PTS" },
  { key: "rebounds_total", display: "REB" },
  { key: "assists", display: "AST" },
  { key: "steals", display: "STL" },
  { key: "blocked_shots", display: "BLK" },
  { key: "turnovers", display: "TO" },
  { key: "fg", display: "FG", isCombined: true },
  { key: "3pt", display: "3PT", isCombined: true },
  { key: "ft", display: "FT", isCombined: true },
] as const

function getStatValue(
  player: BasketballPlayerRecord,
  stat: (typeof displayStats)[number],
): string {
  if (stat.key === "fg") {
    return `${player.field_goals_made}/${player.field_goals_attempted}`
  }
  if (stat.key === "3pt") {
    return `${player.three_point_field_goals_made}/${player.three_point_field_goals_attempted}`
  }
  if (stat.key === "ft") {
    return `${player.free_throws_made}/${player.free_throws_attempted}`
  }
  return String(player[stat.key as keyof BasketballPlayerRecord] ?? "-")
}

export function BasketballBoxScore({
  boxScore,
  game,
  teamRecords,
}: {
  boxScore: { home: BasketballPlayerRecord[]; away: BasketballPlayerRecord[] }
  game: Game
  teamRecords?: {
    home: BasketballTeamRecord
    away: BasketballTeamRecord
  } | null
}) {
  let [team, setTeam] = useState<"home" | "away">("home")
  let isDark = useColorScheme() === "dark"

  return (
    <View className="flex gap-4">
      <SegmentedControl
        values={[game.home_team.abbreviation, game.away_team.abbreviation]}
        selectedIndex={team === "home" ? 0 : 1}
        onValueChange={(e) =>
          setTeam(e === game.home_team.abbreviation ? "home" : "away")
        }
        tintColor={"#" + game[`${team}_team`].colour_1}
        backgroundColor={isDark ? colors.zinc[800] : colors.zinc[100]}
        fontStyle={{
          color: isDark ? colors.zinc[100] : colors.zinc[800],
          fontSize: 13,
        }}
        activeFontStyle={{ color: colors.zinc[100], fontSize: 13 }}
        style={{ height: 28, width: 140, alignSelf: "center" }}
      />
      <View className="-mx-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="px-4">
            {/* Header row */}
            <View className="flex flex-row border-b border-zinc-600">
              <View style={{ width: NAME_WIDTH }}>
                <Text style={styles.nameHeaderCell}>Name</Text>
              </View>
              {displayStats.map((stat) => (
                <View key={stat.key} style={{ width: CELL_WIDTH }}>
                  <Text style={styles.headerCell}>{stat.display}</Text>
                </View>
              ))}
            </View>
            {/* Data rows */}
            {boxScore[team].map((player, index) => (
              <View
                key={player.id}
                style={[
                  {
                    marginLeft: -16,
                    paddingLeft: 16,
                    marginRight: -16,
                    paddingRight: 16,
                  },
                  index % 2 === 1 && {
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                  },
                ]}
                className="flex flex-row items-center"
              >
                <View style={{ width: NAME_WIDTH }}>
                  <Text style={styles.nameCell}>
                    {player.player.first_initial_and_last_name}
                  </Text>
                </View>
                {displayStats.map((stat) => (
                  <View key={stat.key} style={{ width: CELL_WIDTH }}>
                    <Text style={styles.cell}>
                      {getStatValue(player, stat)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {teamRecords && teamRecords.home && teamRecords.away && (
        <TeamStats
          home={teamRecords.home}
          away={teamRecords.away}
          game={game}
        />
      )}
    </View>
  )
}

function getTeamStats(record: BasketballTeamRecord) {
  return [
    {
      label: "FG",
      value: `${record.field_goals_made}/${record.field_goals_attempted}`,
      pct: record.field_goals_percentage,
    },
    {
      label: "3PT",
      value: `${record.three_point_field_goals_made}/${record.three_point_field_goals_attempted}`,
      pct: record.three_point_field_goals_percentage ?? "-",
    },
    {
      label: "FT",
      value: `${record.free_throws_made}/${record.free_throws_attempted}`,
      pct: record.free_throws_percentage,
    },
    { label: "REB", value: record.rebounds_total },
    { label: "AST", value: record.assists },
    { label: "STL", value: record.steals },
    { label: "BLK", value: record.blocked_shots },
    { label: "TO", value: record.turnovers },
    { label: "PF", value: record.personal_fouls },
  ]
}

function TeamStats({
  home,
  away,
  game,
}: {
  home: BasketballTeamRecord
  away: BasketballTeamRecord
  game: Game
}) {
  const homeStats = getTeamStats(home)
  const awayStats = getTeamStats(away)

  return (
    <View className="mt-6">
      <Text className="text-base font-semibold mb-3">Team Stats</Text>
      <View className="border-t border-zinc-200 dark:border-zinc-700">
        {/* Column headers */}
        <View className="flex-row items-center py-3 border-b border-zinc-200 dark:border-zinc-700">
          <View className="flex-1" />
          <Text className="w-20 text-center text-sm font-bold">
            {game.away_team.abbreviation}
          </Text>
          <Text className="w-20 text-center text-sm font-bold">
            {game.home_team.abbreviation}
          </Text>
        </View>
        {homeStats.map((stat, i) => (
          <View
            key={stat.label}
            className="flex-row items-center py-3 border-b border-zinc-200 dark:border-zinc-700"
          >
            <Text className="flex-1 text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </Text>
            <Text className="w-20 text-center text-base font-medium tabular-nums">
              {awayStats[i].value}
            </Text>
            <Text className="w-20 text-center text-base font-medium tabular-nums">
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  nameHeaderCell: {
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 12,
    textAlign: "left",
  },
  nameCell: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 12,
    textAlign: "left",
  },
  headerCell: {
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 12,
    textAlign: "center",
  },
  cell: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 12,
    textAlign: "center",
  },
})
