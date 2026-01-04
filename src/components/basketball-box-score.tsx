import React, { useState } from "react"
import { FlatList, ScrollView, useColorScheme, View } from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
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
  let isDark = useColorScheme() === "dark"

  return (
    <View className="flex gap-4">
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
      <ScrollView horizontal>
        <View className="flex-1 flex gap-4">
          <FlatList
            data={displayStats}
            keyExtractor={(item) => item.key}
            horizontal
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <Text
                className="font-semibold"
                style={{ width: 48, marginLeft: index === 0 ? 120 : 0 }}
              >
                {item.display}
              </Text>
            )}
          />
          <FlatList
            data={boxScore[team]}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View className="h-4" />}
            renderItem={({ item }) => (
              <View className="flex flex-row gap-2">
                <Text style={{ width: 100 }}>
                  {item.player.first_initial_and_last_name}
                </Text>
                {displayStats.map((stat) => (
                  <Text
                    key={`${item.id}-${stat.key}`}
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
