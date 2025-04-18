import React, { useState } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { FlashList } from "@shopify/flash-list"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { BasketballPlayerRecord, Game } from "@/types"

const displayStats = [
  { key: "minutes", display: "MIN" },
  { key: "points", display: "PTS" },
  { key: "rebounds_total", display: "REB" },
  { key: "assists", display: "AST" },
  { key: "steals", display: "STL" },
  { key: "blocked_shots", display: "BLK" },
  { key: "field_goals_attempted", display: "FGA" },
  { key: "field_goals_made", display: "FGM" },
  { key: "three_point_field_goals_attempted", display: "3PA" },
  { key: "three_point_field_goals_made", display: "3PM" },
  { key: "free_throws_attempted", display: "FTA" },
  { key: "free_throws_made", display: "FTM" },
] as const

export function BasketballBoxScore({
  boxScore,
  game,
}: {
  boxScore: { home: BasketballPlayerRecord[]; away: BasketballPlayerRecord[] }
  game: Game
}) {
  let [team, setTeam] = useState<"home" | "away">("home")
  return (
    <View className="flex gap-4">
      <SegmentedControl
        values={[game.home_team.abbreviation, game.away_team.abbreviation]}
        selectedIndex={0}
        onValueChange={(e) =>
          setTeam(e === game.home_team.abbreviation ? "home" : "away")
        }
        tintColor={"#" + game[`${team}_team`].colour_1}
        backgroundColor={colors.stone["50"]}
        fontStyle={{ color: colors.stone["600"] }}
        activeFontStyle={{ color: colors.stone["50"] }}
      />
      <ScrollView className="" horizontal>
        <View className="flex-1 flex gap-4">
          <FlashList
            data={displayStats}
            keyExtractor={(item) => item.key}
            horizontal
            scrollEnabled={false}
            estimatedItemSize={28}
            renderItem={({ item, index }) => (
              <Text
                className="font-semibold"
                style={{ width: 48, marginLeft: index === 0 ? 120 : 0 }}
              >
                {item.display}
              </Text>
            )}
          />
          <FlashList
            data={boxScore[team]}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View className="h-4" />}
            estimatedItemSize={48}
            renderItem={({ item }) => (
              <View className="flex flex-row gap-2">
                <Text style={{ width: 100 }}>
                  {item.player.first_initial_and_last_name}
                </Text>
                {displayStats.map((stat) => (
                  <Text
                    key={`${item.id}-${stat}`}
                    style={{ width: 40, textAlign: "right" }}
                  >
                    {item[stat.key]}
                  </Text>
                ))}
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
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
