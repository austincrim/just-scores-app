import "./global.css"
import { useCallback } from "react"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { createStaticNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { SafeAreaProvider } from "react-native-safe-area-context"
import colors from "tailwindcss/colors"
import { persister } from "@/lib/storage"
import { GameDetails } from "@/screens/game-details"
import { Tabs } from "@/screens/tabs"
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
    details: { screen: GameDetails },
  },
})
let Navigator = createStaticNavigation(Stack)
let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  },
})
SplashScreen.preventAutoHideAsync()

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    OffBit: require("./assets/fonts/OffBitTrial-Regular.otf"),
    OffBitBold: require("./assets/fonts/OffBitTrial-Bold.otf"),
  })

  let onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <SafeAreaProvider
      onLayout={onLayoutRootView}
      style={{ backgroundColor: colors.zinc[100] }}
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <Navigator
          theme={{
            colors: {
              background: colors.zinc[100],
              border: colors.zinc[200],
              card: colors.zinc[100],
              primary: colors.emerald[500],
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
          }}
        />
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  )
}
