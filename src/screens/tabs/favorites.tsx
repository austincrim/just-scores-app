import { View } from "react-native"
import { Text } from "@/components/text"
import { TabScreenProps } from "../types"

type Props = TabScreenProps<"favorites">
export function Favorites({}: Props) {
  return (
    <View className="pt-4 px-2 flex-1">
      <Text>Favorites</Text>
    </View>
  )
}
