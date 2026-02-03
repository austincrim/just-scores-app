declare module "expo-widgets" {
  import { JSX } from "react"

  export type WidgetFamily =
    | "systemSmall"
    | "systemMedium"
    | "systemLarge"
    | "systemExtraLarge"
    | "accessoryCircular"
    | "accessoryRectangular"
    | "accessoryInline"

  export interface WidgetBase<T = object> {
    date: Date
    family: WidgetFamily
  }

  export interface ExpoLiveActivityEntry {
    banner: JSX.Element
    compactLeading: JSX.Element
    compactTrailing: JSX.Element
    minimal: JSX.Element
    expandedLeading?: JSX.Element
    expandedTrailing?: JSX.Element
    expandedBottom?: JSX.Element
  }

  export type LiveActivityComponent = () => ExpoLiveActivityEntry

  export function startLiveActivity(
    name: string,
    liveActivity: LiveActivityComponent,
    url?: string,
  ): string

  export function updateLiveActivity(
    id: string,
    name: string,
    liveActivity: LiveActivityComponent,
  ): void

  export function updateWidgetSnapshot<T>(
    name: string,
    widget: (p: WidgetBase<T>) => JSX.Element,
    props?: T,
    updateFunction?: string,
  ): void

  export function updateWidgetTimeline<T>(
    name: string,
    dates: Date[],
    widget: (p: WidgetBase<T>) => JSX.Element,
    props?: T,
    updateFunction?: string,
  ): void

  export interface UserInteractionEvent {
    widgetName: string
    action: string
  }

  export interface EventSubscription {
    remove: () => void
  }

  export function addUserInteractionListener(
    listener: (event: UserInteractionEvent) => void,
  ): EventSubscription
}
