import { ScrollView, StyleSheet, Text, View } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { type FootballPlayerRecord, type Game } from "@/types"

/**
  for each position type, filter to only relevant properties
  sort players by relevant stats
  tab view for each team
**/

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

  // Get all unique stats from all players
  const allStats = Array.from(new Set(boxScore.home.flatMap(Object.keys)))

  return (
    <FlashList
      data={Object.entries(playersByPosition)}
      horizontal
      renderItem={({ item: [type, players] }) => (
        <View key={type}>
          <Text style={styles.positionHeader}>{type}</Text>
          <ScrollView horizontal>
            <View>
              <View style={styles.headerRow}>
                <Text style={styles.headerCell}>Name</Text>
                {allStats.map((stat) => (
                  <Text key={stat} style={styles.headerCell}>
                    {stat}
                  </Text>
                ))}
              </View>
              {players.map((player, index) => (
                <View
                  key={player.id}
                  style={[
                    styles.row,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow,
                  ]}
                >
                  <Text style={styles.cell}>{player.player.full_name}</Text>
                  {allStats.map((stat) => (
                    <Text key={stat} style={styles.cell}>
                      {player[stat as keyof FootballPlayerRecord]?.toString() ||
                        "-"}
                    </Text>
                  ))}
                </View>
              ))}
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
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
  },
  headerCell: {
    fontWeight: "bold",
    padding: 10,
    width: 100,
  },
  row: {
    flexDirection: "row",
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
