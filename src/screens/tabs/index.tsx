import { useState } from "react"
import { Pressable, Text, TouchableOpacity } from "react-native"
import * as Haptics from "expo-haptics"
import { SymbolView } from "expo-symbols"
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { ContextMenuButton } from "react-native-ios-context-menu"
import colors from "tailwindcss/colors"
import { TabsParamList } from "../types"
import { Favorites } from "./favorites"
import { NcaaFB } from "./sport"

let { Navigator, Screen } = createBottomTabNavigator<TabsParamList>()
export function Tabs() {
  let [sport, setSport] = useState<"ncaaf" | "ncaab" | "nfl">("ncaaf")
  let title =
    sport === "ncaaf"
      ? "NCAA Football"
      : sport === "ncaab"
        ? "NCAA Basketball"
        : "NFL"

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.amber["700"],
      }}
    >
      <Screen
        name="scores"
        component={NcaaFB}
        initialParams={{ sport }}
        navigationKey={sport}
        options={{
          headerTitle: () => (
            <ContextMenuButton
              menuConfig={{
                menuTitle: "",
                menuItems: [
                  { actionTitle: "NCAA Football", actionKey: "ncaaf" },
                  { actionTitle: "NCAA Basketball", actionKey: "ncaab" },
                  { actionTitle: "NFL", actionKey: "nfl" },
                ],
              }}
              onPressMenuItem={({ nativeEvent }) => {
                // @ts-ignore
                setSport(nativeEvent.actionKey)
              }}
            >
              <TouchableOpacity className="flex flex-row items-center gap-3">
                <Text className="font-semibold text-xl">{title}</Text>
                <SymbolView
                  name="chevron.down"
                  size={10}
                  resizeMode="scaleAspectFill"
                />
              </TouchableOpacity>
            </ContextMenuButton>
          ),
          tabBarLabel: "Scores",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "football.fill" : "football"}
              tintColor={color}
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Screen
        name="favorites"
        component={Favorites}
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "star.fill" : "star"}
              tintColor={color}
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Navigator>
  )
}

function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        props.onPress?.(e)
      }}
      style={props.style}
    >
      {props.children}
    </Pressable>
  )
}
