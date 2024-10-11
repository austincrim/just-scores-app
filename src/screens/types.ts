import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

export type RootStackParamList = {
  Scores: NavigatorScreenParams<TabsParamList>
  GameDetails: { sport: "ncaaf" | "nfl" | "ncaab"; id: string }
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>

export type TabsParamList = {
  scores: { sport: "ncaaf" | "nfl" | "ncaab" }
  favorites: undefined
}

export type TabScreenProps<T extends keyof TabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
