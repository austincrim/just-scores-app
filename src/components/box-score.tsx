import { ScrollView, StyleSheet, Text, View } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { type FootballPlayerRecord } from "@/types"

type StatCategory = {
  [key: string]: Array<
    | keyof FootballPlayerRecord
    | { key: keyof FootballPlayerRecord; display: string }
  >
}

const statCategories: StatCategory = {
  passing: [
    { key: "passing_attempts", display: "ATT" },
    { key: "passing_completions", display: "COMP" },
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
    { key: "receiving_targets", display: "TGTS" },
    { key: "receiving_receptions", display: "REC" },
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
    "kick_returns",
    "kick_return_yards",
    "kick_return_touchdowns",
    "kick_return_yards_long",
    "kick_return_yards_average",
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

export function BoxScore({
  boxScore,
}: {
  boxScore: { home: FootballPlayerRecord[]; away: FootballPlayerRecord[] }
}) {
  const playersByPosition = boxScore.home.reduce(
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
    <FlashList
      data={Object.entries(statCategories)}
      estimatedItemSize={7000}
      ItemSeparatorComponent={() => <View className="my-4" />}
      renderItem={({ item: [type, stats] }) => (
        <View key={type}>
          <Text style={styles.positionHeader}>{type.replaceAll("_", " ")}</Text>
          <ScrollView horizontal>
            <View>
              <FlashList
                horizontal
                data={["Name", ...stats]}
                estimatedItemSize={99}
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
              <FlashList
                data={playersByPosition[type]}
                estimatedItemSize={99}
                scrollEnabled={false}
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
          </ScrollView>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  positionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    textTransform: "capitalize",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
  },
  headerCell: {
    fontWeight: "bold",
    padding: 10,
    width: 100,
    flex: 1,
  },
  evenRow: {
    backgroundColor: "#f8f8f8",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  cell: {
    padding: 10,
    width: 100,
  },
})
