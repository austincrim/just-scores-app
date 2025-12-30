import "./global.css"
import { useColorScheme } from "react-native"
import { createStaticNavigation, DarkTheme } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import colors from "tailwindcss/colors"
import { persister } from "@/lib/storage"
import { GameDetails } from "@/screens/game-details"
import { Tabs } from "@/screens/tabs"
import { TeamDetail } from "@/screens/team-details"
import { RootStackParamList } from "@/screens/types"

let Stack = createNativeStackNavigator<RootStackParamList>({
  screens: {
    tabs: {
      screen: Tabs,
      options: {
        headerShown: false,
        title: "Scores",
      },
    },
    details: { screen: GameDetails, options: { title: "" } },
    team: { screen: TeamDetail, options: { title: "" } },
  },
})
let lightTheme = {
  colors: {
    background: colors.zinc[100],
    border: colors.zinc[200],
    card: colors.zinc[100],
    primary: colors.sky[600],
    text: colors.zinc[800],
    notification: colors.zinc[800],
  },
  fonts: {
    regular: { fontFamily: "Inter", fontWeight: "500" },
    medium: { fontFamily: "Inter", fontWeight: "300" },
    bold: { fontFamily: "Inter", fontWeight: "700" },
    heavy: { fontFamily: "Inter", fontWeight: "900" },
  },
  dark: false,
} as const
let darkTheme = {
  ...DarkTheme,
  colors: {
    background: colors.zinc[800],
    border: colors.zinc[700],
    card: colors.zinc[700],
    primary: colors.sky[300],
    text: colors.zinc[100],
    notification: colors.zinc[100],
  },
  fonts: {
    regular: { fontFamily: "Inter", fontWeight: "500" },
    medium: { fontFamily: "Inter", fontWeight: "300" },
    bold: { fontFamily: "Inter", fontWeight: "700" },
    heavy: { fontFamily: "Inter", fontWeight: "900" },
  },
  dark: true,
} as const

let Navigator = createStaticNavigation(Stack)
let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  },
})

export default function App() {
  let scheme = useColorScheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <Navigator theme={scheme === "dark" ? darkTheme : lightTheme} />
        </PersistQueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
