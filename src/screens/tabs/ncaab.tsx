import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { useSchedule } from "@/lib/hooks"
import GamePreview from "@/components/game-preview"
import { useQuery } from "@tanstack/react-query"

export function NcaaBB() {
  let [page, setPage] = useState(1)
  let { data, status } = useQuery({
    queryKey: ["todos", page],
    queryFn: async () => {
      let res = await fetch("https://dummyjson.com/todos")
      return res.json()
    }
  })

  if (status !== "success") {
    return <Text className="flex-1 text-center">loading...</Text>
  }

  if (!data) {
    return <Text className="flex-1 text-center">No games found</Text>
  }

  return (
    <View className="pt-4 px-2 flex-1">
      <TouchableOpacity onPress={() => setPage((p) => (p === 1 ? 2 : 1))}>
        <Text>{page}</Text>
      </TouchableOpacity>
      <FlashList
        data={data.todos}
        renderItem={({ item }) => <Text>{item.todo}</Text>}
      />
    </View>
  )
}
