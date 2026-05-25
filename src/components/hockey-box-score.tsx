import React, { useMemo, useState } from "react"
import {
  FlatList,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import colors from "tailwindcss/colors"
import { NHLEvent, PlayerRecord } from "@/types"
import { Text } from "./text"

type HockeyPlayerRecord = PlayerRecord & {
  alignment?: string
  player?: {
    id: number
    first_initial_and_last_name?: string
    full_name?: string
    position_abbreviation?: string
  }
  goals?: number
  assists?: number
  points?: number
  shots_on_goal?: number
  plus_minus?: number
  penalty_minutes?: number
  time_on_ice_full?: string
  faceoffs_won?: number
  faceoffs_lost?: number
  save_percentage?: string
  goals_against?: number
}

const CELL_WIDTH = 56
const NAME_WIDTH = 116

const skaterStats: Array<keyof HockeyPlayerRecord> = [
  "goals",
  "assists",
  "points",
  "shots_on_goal",
  "plus_minus",
  "penalty_minutes",
  "time_on_ice_full",
]

const goalieStats: Array<keyof HockeyPlayerRecord> = [
  "goals_against",
  "save_percentage",
  "time_on_ice_full",
]

export function HockeyBoxScore({
  boxScore,
  game,
}: {
  boxScore: { home: HockeyPlayerRecord[]; away: HockeyPlayerRecord[] }
  game: NHLEvent
}) {
  const [team, setTeam] = useState<"home" | "away">("home")
  const isDark = useColorScheme() === "dark"

  const { skaters, goalies } = useMemo(() => {
    const records = boxScore[team] ?? []
    return {
      skaters: records.filter((p) => p.player?.position_abbreviation !== "G"),
      goalies: records.filter((p) => p.player?.position_abbreviation === "G"),
    }
  }, [boxScore, team])

  return (
    <View className="mt-8">
      <SegmentedControl
        values={[game.home_team.abbreviation, game.away_team.abbreviation]}
        selectedIndex={team === "home" ? 0 : 1}
        onValueChange={(value) =>
          setTeam(value === game.home_team.abbreviation ? "home" : "away")
        }
        tintColor={`#${game[`${team}_team`].colour_1}`}
        backgroundColor={isDark ? colors.zinc[800] : colors.zinc[100]}
        fontStyle={{
          color: isDark ? colors.zinc[100] : colors.zinc[800],
          fontSize: 13,
        }}
        activeFontStyle={{ color: colors.zinc[100], fontSize: 13 }}
        style={{ height: 28, width: 140, alignSelf: "center" }}
      />

      <View className="mt-4">
        <StatsTable players={skaters} stats={skaterStats} />
      </View>

      {goalies.length > 0 && (
        <View className="mt-6">
          <Text className="font-semibold mb-2">Goalies</Text>
          <StatsTable players={goalies} stats={goalieStats} />
        </View>
      )}
    </View>
  )
}

function StatsTable({
  players,
  stats,
}: {
  players: HockeyPlayerRecord[]
  stats: Array<keyof HockeyPlayerRecord>
}) {
  return (
    <View className="-mx-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="px-4">
          <View className="flex-row border-b border-zinc-600">
            <View style={{ width: NAME_WIDTH }}>
              <Text style={styles.nameHeaderCell}>Name</Text>
            </View>
            {stats.map((stat) => (
              <View key={String(stat)} style={{ width: CELL_WIDTH }}>
                <Text style={styles.headerCell}>{labelForStat(stat)}</Text>
              </View>
            ))}
          </View>
          <FlatList
            data={players}
            keyExtractor={(item) => String(item.player?.id ?? item.alignment)}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View
                style={[
                  {
                    marginLeft: -16,
                    paddingLeft: 16,
                    marginRight: -16,
                    paddingRight: 16,
                  },
                  index % 2 === 1 && {
                    backgroundColor: "rgba(113, 113, 122, 0.08)",
                  },
                ]}
                className="flex-row items-center"
              >
                <View style={{ width: NAME_WIDTH }}>
                  <Text style={styles.nameCell}>
                    {item.player?.first_initial_and_last_name ??
                      item.player?.full_name ??
                      "-"}
                  </Text>
                </View>
                {stats.map((stat) => (
                  <View key={String(stat)} style={{ width: CELL_WIDTH }}>
                    <Text style={styles.cell}>{valueForStat(item, stat)}</Text>
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

function labelForStat(stat: keyof HockeyPlayerRecord): string {
  switch (stat) {
    case "goals":
      return "G"
    case "assists":
      return "A"
    case "points":
      return "PTS"
    case "shots_on_goal":
      return "SOG"
    case "plus_minus":
      return "+/-"
    case "penalty_minutes":
      return "PIM"
    case "time_on_ice_full":
      return "TOI"
    case "goals_against":
      return "GA"
    case "save_percentage":
      return "SV%"
    default:
      return String(stat).toUpperCase()
  }
}

function valueForStat(
  player: HockeyPlayerRecord,
  stat: keyof HockeyPlayerRecord,
): string {
  if (stat === "points") {
    const points = (player.goals ?? 0) + (player.assists ?? 0)
    return String(points)
  }
  const value = player[stat]
  return value == null ? "-" : String(value)
}

const styles = StyleSheet.create({
  nameHeaderCell: {
    fontWeight: "bold",
    paddingVertical: 8,
    fontSize: 12,
    textAlign: "left",
  },
  nameCell: {
    paddingVertical: 8,
    fontSize: 12,
    textAlign: "left",
  },
  headerCell: {
    fontWeight: "bold",
    paddingVertical: 8,
    fontSize: 12,
    textAlign: "center",
  },
  cell: {
    paddingVertical: 8,
    fontSize: 12,
    textAlign: "center",
  },
})
