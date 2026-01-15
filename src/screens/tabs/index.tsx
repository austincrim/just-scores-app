import { forwardRef, useRef, useState } from "react"
import { Pressable, useColorScheme, View } from "react-native"
import * as Haptics from "expo-haptics"
import { SymbolView } from "expo-symbols"
import { TrueSheet } from "@lodev09/react-native-true-sheet"
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { useNavigationState } from "@react-navigation/native"
import colors from "tailwindcss/colors"
import { Text } from "@/components/text"
import { useLiveLeagues } from "@/lib/hooks"
import { TabsParamList } from "../types"
import { Favorites } from "./favorites"
import { SportSchedule } from "./sport"

let { Navigator, Screen } = createBottomTabNavigator<TabsParamList>()

export function Tabs() {
  let isDark = useColorScheme() === "dark"
  let iconColor = isDark ? colors.zinc[300] : colors.zinc[800]
  let sheetRef = useRef<TrueSheet>(null)
  let [sport, setSport] = useState<"ncaaf" | "ncaab" | "nfl">("nfl")
  let currentRouteName = useNavigationState((state) => {
    const route = state.routes[state.index]

    if (route.state) {
      return route.state.routes[route.state.index!].name
    }

    return route.name
  })

  let { data: liveCounts } = useLiveLeagues()

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
            ),
            tabBarLabel: "Scores",
            tabBarIcon: ({ color, focused }) => (
              <View className="flex flex-row items-center">
                {sport === "ncaab" ? (
                  <SymbolView
                    name={focused ? "basketball.fill" : "basketball"}
                    tintColor={color}
                  />
                ) : sport === "nfl" ? (
                  <SymbolView
                    name={
                      focused
                        ? "american.football.professional.fill"
                        : "football"
                    }
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
              // @ts-expect-error BottomTabBarButtonProps has incompatible ref type
              <HapticTab
                {...props}
                onPress={(e) =>
                  currentRouteName === "scores" || currentRouteName === "tabs"
                    ? sheetRef.current?.present()
                    : props.onPress!(e)
                }
              />
            ),
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
            // @ts-expect-error BottomTabBarButtonProps has incompatible ref type
            tabBarButton: (props) => <HapticTab {...props} />,
          }}
        />
      </Navigator>
      <TrueSheet ref={sheetRef} detents={[0.2]} style={{ paddingVertical: 24 }}>
        <Pressable
          className="flex-row px-4 py-4 items-center justify-between"
          onPress={() => {
            setSport("nfl")
            sheetRef.current?.dismiss()
          }}
        >
          <View className="flex-row items-center gap-1">
            <SymbolView
              tintColor={iconColor}
              name="american.football.professional"
            />
            <Text className="text-xl">NFL</Text>
            {sport === "nfl" && <SymbolView size={16} name="checkmark" />}
          </View>
          <LiveBadge count={liveCounts?.nfl ?? 0} iconColor={iconColor} />
        </Pressable>
        <Pressable
          className="flex-row px-4 py-4 items-center justify-between"
          onPress={() => {
            setSport("ncaaf")
            sheetRef.current?.dismiss()
          }}
        >
          <View className="flex-row items-center gap-1">
            <SymbolView tintColor={iconColor} name="football" />
            <Text className="text-xl">NCAA Football</Text>
            {sport === "ncaaf" && <SymbolView size={16} name="checkmark" />}
          </View>
          <LiveBadge count={liveCounts?.ncaaf ?? 0} iconColor={iconColor} />
        </Pressable>
        <Pressable
          className="flex-row px-4 py-4 items-center justify-between"
          onPress={() => {
            setSport("ncaab")
            sheetRef.current?.dismiss()
          }}
        >
          <View className="flex-row items-center gap-1">
            <SymbolView tintColor={iconColor} name="basketball" />
            <Text className="text-xl">NCAA Basketball</Text>
            {sport === "ncaab" && <SymbolView size={16} name="checkmark" />}
          </View>
          <LiveBadge count={liveCounts?.ncaab ?? 0} iconColor={iconColor} />
        </Pressable>
      </TrueSheet>
    </>
  )
}

function LiveBadge({ count, iconColor }: { count: number; iconColor: string }) {
  if (!count) return null
  return (
    <View className="flex-row items-center gap-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg px-2.5 py-1">
      <SymbolView
        name="dot.radiowaves.left.and.right"
        size={14}
        tintColor={iconColor}
      />
      <Text className="text-sm font-medium">{count} live</Text>
    </View>
  )
}

const HapticTab = forwardRef<View, Omit<BottomTabBarButtonProps, "ref">>(
  (props, ref) => {
    return (
      <Pressable
        ref={ref}
        onPress={(e) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          props.onPress?.(e)
        }}
        style={props.style}
      >
        {props.children}
      </Pressable>
    )
  },
)
