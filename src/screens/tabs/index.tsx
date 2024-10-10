import { Pressable } from "react-native"
import * as Haptics from "expo-haptics"
import { SymbolView } from "expo-symbols"
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import colors from "tailwindcss/colors"
import { NcaaBB } from "./ncaab"
import { NcaaFB } from "./ncaaf"
import { Nfl } from "./nfl"

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

let { Navigator, Screen } = createBottomTabNavigator()
export function Tabs() {
  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.amber["700"],
      }}
    >
      <Screen
        name="ncaaf"
        component={NcaaFB}
        initialParams={{ sport: "ncaaf" }}
        options={{
          title: "NCAA Football",
          tabBarLabel: "NCAA",
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
        name="ncaab"
        component={NcaaBB}
        initialParams={{ sport: "ncaab" }}
        options={{
          title: "NCAA Basketball",
          tabBarLabel: "NCAA",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "basketball.fill" : "basketball"}
              tintColor={color}
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
      <Screen
        name="nfl"
        component={Nfl}
        initialParams={{ sport: "nfl" }}
        options={{
          title: "NFL",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "football.fill" : "football"}
              tintColor={color}
            />
          ),
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      />
    </Navigator>
  )
}
