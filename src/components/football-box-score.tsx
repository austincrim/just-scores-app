import { useState } from "react"
import {
  FlatList,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import colors from "tailwindcss/colors"
import { Game, type FootballPlayerRecord } from "@/types"
import { Text } from "./text"

type StatCategory = {
  [key: string]: Array<
    | keyof FootballPlayerRecord
    | { key: keyof FootballPlayerRecord; display: string }
  >
}

const statCategories: StatCategory = {
  passing: [
    { key: "passing_completions", display: "COMP" },
    { key: "passing_attempts", display: "ATT" },
    { key: "passing_yards", display: "YDS" },
    { key: "passing_touchdowns", display: "TDS" },
    { key: "passing_interceptions", display: "INTS" },
    { key: "passing_rating", display: "RTNG" },
    { key: "passing_sacks", display: "SCKS" },
  ],
  rushing: [
    { key: "rushing_attempts", display: "RSH" },
    { key: "rushing_yards", display: "YDS" },
    { key: "rushing_touchdowns", display: "TDS" },
    { key: "rushing_yards_long", display: "LONG" },
    { key: "rushing_yards_average", display: "AVG" },
  ],
  receiving: [
    { key: "receiving_receptions", display: "REC" },
    { key: "receiving_targets", display: "TGTS" },
    { key: "receiving_yards", display: "YDS" },
    { key: "receiving_touchdowns", display: "TDS" },
    { key: "receiving_yards_long", display: "LONG" },
    { key: "receiving_yards_average", display: "AVG" },
  ],
  kicking: [
    { key: "field_goals_attempted", display: "ATT" },
    { key: "field_goals_made", display: "MADE" },
    { key: "field_goals_long", display: "LONG" },
    { key: "kicking_extra_points_attempted", display: "XP ATT" },
    { key: "kicking_extra_points_made", display: "XP MADE" },
  ],
  punting: [
    { key: "punts", display: "PUNTS" },
    { key: "punts_yards", display: "YDS" },
    { key: "punts_average", display: "AVG" },
    { key: "punts_inside_20", display: "IN 20" },
    { key: "punts_touchbacks", display: "TB" },
  ],
  kick_returning: [
    { key: "kick_returns", display: "KR" },
    { key: "kick_return_yards", display: "YDS" },
    { key: "kick_return_touchdowns", display: "TDS" },
    { key: "kick_return_yards_long", display: "LONG" },
    { key: "kick_return_yards_average", display: "AVG" },
  ],
  punt_returning: [
    { key: "punt_returns", display: "PR" },
    { key: "punt_return_yards", display: "YDS" },
    { key: "punt_return_touchdowns", display: "TDS" },
    { key: "punt_return_yards_long", display: "LONG" },
    { key: "punt_return_yards_average", display: "AVG" },
  ],
  defense: [
    { key: "defensive_tackles_total", display: "TCKL" },
    { key: "defensive_tackles_assists", display: "AST" },
    { key: "defensive_sacks", display: "SACKS" },
    { key: "interceptions", display: "INT" },
    { key: "interceptions_touchdowns", display: "INT TD" },
    { key: "fumbles_forced", display: "FMBF" },
    { key: "fumbles_own_recovered", display: "FMBR" },
    { key: "fumbles_opponent_recovered", display: "FMBR" },
  ],
}

export function FootballBoxScore({
  boxScore,
  game,
}: {
  boxScore: { home: FootballPlayerRecord[]; away: FootballPlayerRecord[] }
  game: Game
}) {
  let isDark = useColorScheme() === "dark"
  let [team, setTeam] = useState<"home" | "away">("home")
  let playersByPosition = boxScore[team].reduce(
    (acc, player) => {
      player.position_types.forEach((positionType) => {
        if (!acc[positionType]) {
          acc[positionType] = []
        }
        acc[positionType].push(player)
      })
      return acc
    },
    {} as Record<string, FootballPlayerRecord[]>,
  )

  return (
    <>
      <SegmentedControl
        values={[game.home_team.abbreviation, game.away_team.abbreviation]}
        selectedIndex={0}
        onValueChange={(e) =>
          setTeam(e === game.home_team.abbreviation ? "home" : "away")
        }
        tintColor={"#" + game[`${team}_team`].colour_1}
        backgroundColor={isDark ? colors.zinc[800] : colors.zinc["100"]}
        fontStyle={{ color: isDark ? colors.zinc[100] : colors.zinc["800"] }}
        activeFontStyle={{ color: colors.zinc["100"] }}
      />
      <View className="my-4" />
      <FlatList
        data={Object.entries(statCategories)}
        keyExtractor={([k, v]) => k}
        ItemSeparatorComponent={() => <View className="my-2" />}
        renderItem={({ item: [type, stats] }) =>
          playersByPosition[type]?.length > 0 ? (
            <View key={type}>
              <Text style={styles.positionHeader}>
                {type.replaceAll("_", " ")}
              </Text>
              <View>
                <FlatList
                  horizontal
                  data={["Name", ...stats]}
                  renderItem={({ item }) => (
                    <Text
                      key={typeof item === "string" ? item : item.key}
                      style={styles.headerCell}
                    >
                      {(typeof item === "string"
                        ? item
                        : item.display
                      ).replaceAll("_", " ")}
                    </Text>
                  )}
                />
                <FlatList
                  data={playersByPosition[type]}
                  renderItem={({ item, index }) => (
                    <View
                      key={item.id}
                      style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                      className="flex flex-row flex-1 items-center"
                    >
                      <Text style={styles.cell}>{item.player.full_name}</Text>
                      {stats.map((stat) => (
                        <Text
                          key={typeof stat === "string" ? stat : stat.key}
                          style={styles.cell}
                        >
                          {item[typeof stat === "string" ? stat : stat.key]
                            ?.toString()
                            .replaceAll("_", " ")}
                        </Text>
                      ))}
                    </View>
                  )}
                />
              </View>
            </View>
          ) : null
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  positionHeader: {
    fontSize: 14,
    paddingVertical: 10,
    textTransform: "capitalize",
  },
  headerRow: { flexDirection: "row" },
  headerCell: {
    fontWeight: "bold",
    paddingVertical: 10,
    width: 100,
    flex: 1,
  },
  cell: {
    paddingVertical: 10,
    width: 100,
  },
  evenRow: {
    backgroundColor: "transparent",
  },
  oddRow: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
})
