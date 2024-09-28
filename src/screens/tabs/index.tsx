import { SymbolView } from "expo-symbols"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NcaaBB } from "./ncaab"
import { NcaaFB } from "./ncaaf"
import { Nfl } from "./nfl"

let { Navigator, Screen } = createBottomTabNavigator()
export function Tabs() {
  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: "dodgerblue",
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
        }}
      />
    </Navigator>
  )
}
