import { useEffect, useRef } from "react"
import { Animated, ScrollView, View } from "react-native"

export function SkeletonLine({
  width,
  height,
}: {
  width: string
  height: string
}) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <Animated.View
      className={`${width} ${height} rounded-md bg-zinc-300 dark:bg-zinc-700`}
      style={{ opacity }}
    />
  )
}

export function GameDetailsSkeleton() {
  return (
    <ScrollView className="px-4 py-4">
      <View className="flex items-center gap-4">
        {/* Header skeleton */}
        <View className="flex self-start flex-row justify-between w-full items-center gap-2">
          <SkeletonLine width="w-20" height="h-6" />
          <SkeletonLine width="w-24" height="h-5" />
        </View>

        {/* Team lines skeleton */}
        <View className="flex flex-col w-full gap-2">
          <SkeletonTeamLine />
          <SkeletonTeamLine />
        </View>
      </View>

      {/* Score section skeleton */}
      <View className="mt-8 gap-4">
        <SkeletonLine width="w-full" height="h-32" />
      </View>

      {/* Box score skeleton */}
      <View className="pb-12 mt-8 gap-3">
        {[1, 2, 3].map((i) => (
          <SkeletonLine key={i} width="w-full" height="h-12" />
        ))}
      </View>
    </ScrollView>
  )
}

function SkeletonTeamLine() {
  return (
    <View className="flex flex-row items-center justify-between gap-4 py-3">
      <SkeletonLine width="w-20" height="h-20" />
      <View className="flex-1 gap-2">
        <SkeletonLine width="w-32" height="h-6" />
        <SkeletonLine width="w-24" height="h-4" />
      </View>
      <SkeletonLine width="w-16" height="h-12" />
    </View>
  )
}

export function GameListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View className="gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonGameRow key={i} />
      ))}
    </View>
  )
}

function SkeletonGameRow() {
  return (
    <View className="flex-row items-center justify-between py-3 gap-3">
      <View className="flex-row items-center gap-2 flex-1">
        <SkeletonLine width="w-10" height="h-10" />
        <SkeletonLine width="w-24" height="h-5" />
      </View>
      <SkeletonLine width="w-8" height="h-6" />
      <View className="flex-row items-center gap-2 flex-1 justify-end">
        <SkeletonLine width="w-24" height="h-5" />
        <SkeletonLine width="w-10" height="h-10" />
      </View>
    </View>
  )
}

export function TeamDetailsSkeleton() {
  return (
    <ScrollView className="flex-1 px-4 py-4">
      <View className="items-center gap-3 mb-6">
        <SkeletonLine width="w-24" height="h-24" />
        <SkeletonLine width="w-48" height="h-8" />
        <SkeletonLine width="w-20" height="h-6" />
      </View>
      <View className="gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={i} className="flex-row items-center justify-between py-3 gap-3">
            <View className="gap-1">
              <SkeletonLine width="w-16" height="h-4" />
              <View className="flex-row items-center gap-2 mt-1">
                <SkeletonLine width="w-8" height="h-8" />
                <SkeletonLine width="w-28" height="h-5" />
              </View>
            </View>
            <SkeletonLine width="w-16" height="h-5" />
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export function PlaysListSkeleton() {
  return (
    <View className="mt-4 gap-4">
      <SkeletonLine width="w-20" height="h-6" />
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} className="flex-row items-center gap-3 py-2">
          <SkeletonLine width="w-6" height="h-6" />
          <View className="flex-1">
            <SkeletonLine width="w-full" height="h-5" />
          </View>
          <View className="items-end gap-1">
            <SkeletonLine width="w-12" height="h-4" />
            <SkeletonLine width="w-10" height="h-3" />
          </View>
        </View>
      ))}
    </View>
  )
}
