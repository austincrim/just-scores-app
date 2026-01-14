import { useEffect } from "react"
import { Animated, ScrollView, View } from "react-native"

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

function SkeletonLine({
  width,
  height,
}: {
  width: string
  height: string
}) {
  const opacity = new Animated.Value(0.3)

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
      className={`${width} ${height} rounded-md bg-zinc-700`}
      style={{ opacity }}
    />
  )
}

function SkeletonTeamLine() {
  return (
    <View className="flex flex-row items-center justify-between gap-4 py-3">
      {/* Logo */}
      <SkeletonLine width="w-20" height="h-20" />
      {/* Team name and score */}
      <View className="flex-1 gap-2">
        <SkeletonLine width="w-32" height="h-6" />
        <SkeletonLine width="w-24" height="h-4" />
      </View>
      {/* Score */}
      <SkeletonLine width="w-16" height="h-12" />
    </View>
  )
}
