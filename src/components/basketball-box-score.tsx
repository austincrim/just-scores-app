import React, { useState } from "react"
import { FlatList, ScrollView, useColorScheme, View } from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { BasketballPlayerRecord, Game } from "@/types"

const displayStats = [
  // spacing placeholder
  { key: "spacer", display: "" },
  { key: "minutes", display: "MIN" },
  { key: "points", display: "PTS" },
  { key: "rebounds_total", display: "REB" },
  { key: "assists", display: "AST" },
  { key: "steals", display: "STL" },
  { key: "blocked_shots", display: "BLK" },
  { key: "field_goals_made", display: "FGM" },
  { key: "field_goals_attempted", display: "FGA" },
  { key: "three_point_field_goals_made", display: "3PM" },
  { key: "three_point_field_goals_attempted", display: "3PA" },
  { key: "free_throws_made", display: "FTM" },
  { key: "free_throws_attempted", display: "FTA" },
] as const

export function BasketballBoxScore({
  boxScore,
  game,
}: {
  boxScore: { home: BasketballPlayerRecord[]; away: BasketballPlayerRecord[] }
  game: Game
}) {
  let [team, setTeam] = useState<"home" | "away">("home")
  let isDark = useColorScheme() === "dark"

  return (
    <View className="flex gap-8">
      <SegmentedControl
        values={[game.home_team.abbreviation, game.away_team.abbreviation]}
        selectedIndex={0}
        onValueChange={(e) =>
          setTeam(e === game.home_team.abbreviation ? "home" : "away")
        }
        tintColor={"#" + game[`${team}_team`].colour_1}
        backgroundColor={isDark ? colors.zinc[800] : colors.zinc[100]}
        fontStyle={{ color: isDark ? colors.zinc[100] : colors.zinc[800] }}
        activeFontStyle={{ color: colors.zinc[100] }}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-1 flex gap-4">
          <FlatList
            data={displayStats}
            keyExtractor={(item) => item.key}
            horizontal
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={{ width: index === 0 ? 100 : 40 }}>
                <Text className="font-semibold text-center">
                  {item.display}
                </Text>
              </View>
            )}
          />
          <FlatList
            scrollEnabled={false}
            data={boxScore[team]}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View className="h-6" />}
            renderItem={({ item }) => (
              <View className="flex flex-row">
                <View style={{ width: 100 }}>
                  <Text>{item.player.first_initial_and_last_name}</Text>
                </View>
                {displayStats.slice(1).map((stat) => (
                  <View style={{ width: 40 }}>
                    <Text
                      className="text-center"
                      key={`${item.id}-${stat.key}`}
                    >
                      {stat.key === "spacer" ? null : item[stat.key]}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  )
}
