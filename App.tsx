import "./global.css"
import { useCallback } from "react"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { persister } from "@/lib/storage"
import { GameDetails } from "@/screens/game-details"
import { Tabs } from "@/screens/tabs"
import type { RootStackParamList } from "@/screens/types"

let Stack = createNativeStackNavigator<RootStackParamList>()
let queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  },
})
SplashScreen.preventAutoHideAsync()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Scores"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameDetails"
        component={GameDetails}
        options={{ title: "" }}
      />
    </Stack.Navigator>
  )
}

export default function ProvidedApp() {
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
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  )
}
