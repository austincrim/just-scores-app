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

const CELL_WIDTH = 60
const NAME_WIDTH = 100

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
        backgroundColor={isDark ? colors.zinc[800] : colors.zinc[100]}
        fontStyle={{
          color: isDark ? colors.zinc[100] : colors.zinc[800],
          fontSize: 13,
        }}
        activeFontStyle={{ color: colors.zinc[100], fontSize: 13 }}
        style={{ height: 28, width: 140, alignSelf: "center" }}
      />
      <View className="my-4" />
      <FlatList
        data={Object.entries(statCategories)}
        keyExtractor={([k]) => k}
        ItemSeparatorComponent={() => <View className="my-4" />}
        scrollEnabled={false}
        renderItem={({ item: [type, stats] }) =>
          playersByPosition[type]?.length > 0 ? (
            <View key={type}>
              <Text style={styles.positionHeader}>
                {type.replaceAll("_", " ")}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* Header row */}
                  <View className="flex flex-row border-b border-zinc-600">
                    <View style={{ width: NAME_WIDTH }}>
                      <Text style={styles.nameHeaderCell}>Name</Text>
                    </View>
                    {stats.map((stat) => (
                      <View
                        key={typeof stat === "string" ? stat : stat.key}
                        style={{ width: CELL_WIDTH }}
                      >
                        <Text style={styles.headerCell}>
                          {(typeof stat === "string"
                            ? stat
                            : stat.display
                          ).replaceAll("_", " ")}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {/* Data rows */}
                  {playersByPosition[type].map((player, index) => (
                    <View
                      key={player.id}
                      style={[
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
                      {stats.map((stat) => (
                        <View
                          key={typeof stat === "string" ? stat : stat.key}
                          style={{ width: CELL_WIDTH }}
                        >
                          <Text style={styles.cell}>
                            {player[typeof stat === "string" ? stat : stat.key]
                              ?.toString()
                              .replaceAll("_", " ") ?? "-"}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  positionHeader: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 8,
    textTransform: "capitalize",
  },
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
