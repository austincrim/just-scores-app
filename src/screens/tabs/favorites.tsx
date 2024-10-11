import { Text, View } from "react-native"
import { TabScreenProps } from "../types"

type Props = TabScreenProps<"favorites">
export function Favorites({}: Props) {
  return (
    <View className="pt-4 px-2 flex-1">
      <Text>Favorites</Text>
    </View>
  )
}
