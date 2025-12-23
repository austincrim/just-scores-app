import { useRef, useState } from "react"
import { Alert, Pressable, TouchableOpacity, View } from "react-native"
import * as Haptics from "expo-haptics"
import { SymbolView } from "expo-symbols"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { TabsParamList } from "../types"
import { Favorites } from "./favorites"
import { SportSchedule } from "./sport"

let { Navigator, Screen } = createBottomTabNavigator<TabsParamList>()
export function Tabs() {
  let sheetRef = useRef<TrueSheet>(null)
  let [sport, setSport] = useState<"ncaaf" | "ncaab" | "nfl">("ncaab")
  let title =
    sport === "ncaaf"
      ? "NCAA Football"
      : sport === "ncaab"
        ? "NCAA Basketball"
        : "NFL"

  return (
    <>
      <Navigator>
        <Screen
          name="scores"
          component={SportSchedule}
          initialParams={{ sport }}
          navigationKey={sport}
          options={{
            headerTitle: () => (
              <Text className="font-semibold text-xl">{title}</Text>
              // <ContextMenuButton
              //   menuConfig={{
              //     menuTitle: "",
              //     menuItems: [
              //       { actionTitle: "NCAA Football", actionKey: "ncaaf" },
              //       { actionTitle: "NCAA Basketball", actionKey: "ncaab" },
              //       { actionTitle: "NFL", actionKey: "nfl" },
              //     ],
              //   }}
              //   onPressMenuItem={({ nativeEvent }) => {
              //     // @ts-ignore
              //     setSport(nativeEvent.actionKey)
              //   }}
              // >
              //   <TouchableOpacity className="flex flex-row items-center gap-3">
              //     <SymbolView
              //       name="chevron.down"
              //       size={10}
              //       resizeMode="scaleAspectFill"
              //       tintColor={colors.emerald["500"]}
              //     />
              //   </TouchableOpacity>
              // </ContextMenuButton>
            ),
            tabBarLabel: "Scores",
            tabBarIcon: ({ color, focused }) => (
              <View className="flex flex-row items-center">
                {sport === "ncaab" ? (
                  <SymbolView
                    name={focused ? "basketball.fill" : "basketball"}
                    tintColor={color}
                  />
                ) : (
                  <SymbolView
                    name={focused ? "football.fill" : "football"}
                    tintColor={color}
                  />
                )}
                <SymbolView
                  name="chevron.up.chevron.down"
                  tintColor={color}
                  size={12}
                />
              </View>
            ),
            tabBarButton: (props) => (
              <HapticTab
                {...props}
                onLongPress={() => sheetRef.current?.present()}
              />
            ),
            headerStyle: {
              backgroundColor: colors.zinc["800"],
            },
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
      <TrueSheet
        ref={sheetRef}
        detents={["auto"]}
        backgroundColor={colors.zinc[800]}
      >
        <View className="py-2">
          <Pressable
            onPress={() => {
              setSport("nfl")
              sheetRef.current?.dismiss()
            }}
            className="w-full py-4 px-8"
          >
            <Text className="text-2xl">NFL</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSport("ncaaf")
              sheetRef.current?.dismiss()
            }}
            className="w-full py-4 px-8"
          >
            <Text className="text-2xl">NCAA Football</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setSport("ncaab")
              sheetRef.current?.dismiss()
            }}
            className="w-full py-4 px-8"
          >
            <Text className="text-2xl">NCAA Basketball</Text>
          </Pressable>
        </View>
      </TrueSheet>
    </>
  )
}

function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
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
