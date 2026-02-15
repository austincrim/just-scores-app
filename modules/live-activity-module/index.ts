import { NativeModule, requireNativeModule } from "expo"

type LiveActivityModuleEvents = {}

declare class LiveActivityModuleType extends NativeModule<LiveActivityModuleEvents> {
  endActivity: (activityId: string) => Promise<void>
}

const LiveActivityModuleNative =
  requireNativeModule<LiveActivityModuleType>("LiveActivityModule")

export function endActivity(activityId: string): Promise<void> {
  return LiveActivityModuleNative.endActivity(activityId)
}
