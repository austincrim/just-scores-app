import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { API_URL } from "@/lib/hooks"
import { RootStackScreenProps } from "./types"

type Props = RootStackScreenProps<"conference">

type StandingEntry = {
  id: number
  conference_rank: number
  short_record: string
  conference_wins: number
  conference_losses: number
  team: {
    id: number
    name: string
    full_name: string
    logos: {
      small: string
      w72xh72: string
    }
  }
}

export function ConferenceStandings({ route }: Props) {
  let navigation = useNavigation()
  let isDark = useColorScheme() === "dark"
  let { sport, conference } = route.params
  let borderColor = isDark ? colors.zinc[700] : colors.zinc[300]

  let { data: standings, status } = useQuery({
    queryKey: [sport, "standings", "conference", conference],
    queryFn: async () => {
      let res = await fetch(
        `${API_URL}/${sport}/standings?conference=${encodeURIComponent(conference)}`,
      )
      if (!res.ok) {
        console.error(await res.text())
        return []
      }
      let data = (await res.json()) as StandingEntry[]
      data.sort((a, b) => a.conference_rank - b.conference_rank)
      return data
    },
  })

  if (status === "pending") {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  if (!standings || standings.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No standings found</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 px-4 py-4">
      <View>
        <View
          className="flex-row items-center py-2 px-3"
          style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor,
          }}
        >
          <Text className="w-8 text-sm font-bold">#</Text>
          <Text className="flex-1 text-sm font-bold">Team</Text>
          <Text className="w-16 text-sm font-bold text-center">Conf</Text>
          <Text className="w-16 text-sm font-bold text-center">Overall</Text>
        </View>
        {standings.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            onPress={() =>
              navigation.navigate("team", {
                sport,
                teamId: entry.team.id,
                teamName: entry.team.name,
              })
            }
          >
            <View
              className="flex-row items-center py-3 px-3"
              style={{
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor,
              }}
            >
              <Text className="w-8 text-sm">{entry.conference_rank}</Text>
              <View className="flex-1 flex-row items-center gap-2">
                <Image
                  source={{ uri: entry.team.logos.small }}
                  className="w-6 h-6"
                />
                <Text className="flex-1" numberOfLines={1}>
                  {entry.team.name}
                </Text>
              </View>
              <Text className="w-16 text-sm text-center">
                {entry.conference_wins}-{entry.conference_losses}
              </Text>
              <Text className="w-16 text-sm text-center">
                {entry.short_record}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}
