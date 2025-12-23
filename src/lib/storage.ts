import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { createMMKV } from "react-native-mmkv"

export let storage = createMMKV()

let clientStorage = {
  setItem: (key: string, value: boolean | string | number) => {
    storage.set(key, value)
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return value === undefined ? null : value
  },
  removeItem: (key: string) => {
    storage.remove(key)
  },
}

export let persister = createSyncStoragePersister({
  storage: clientStorage,
})
