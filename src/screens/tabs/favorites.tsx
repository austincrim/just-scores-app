import { View } from "react-native"
import { useUpdates } from "expo-updates"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { TabScreenProps } from "../types"

type Props = TabScreenProps<"favorites">
export function Favorites({}: Props) {
  let { currentlyRunning, isDownloading } = useUpdates()

  return (
    <View className="pt-4 px-2 flex-1">
      <Text>Favorites</Text>
      <Text>Add teams to favorites and get all their scores in one place.</Text>
      <Text
        style={{
          fontSize: 10,
          color: colors.zinc[700],
          paddingTop: 12,
        }}
      >
        {isDownloading
          ? "Downloading..."
          : (currentlyRunning.updateId?.split("-")[0] ??
            "Unable to determine version")}
      </Text>
    </View>
  )
}
