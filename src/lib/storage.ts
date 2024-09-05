import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { MMKV } from "react-native-mmkv"

let storage = new MMKV()
let clientStorage = {
  setItem: (key: string, value: boolean | string | number) => {
    storage.set(key, value)
  },
  getItem: (key: string) => {
    const value = storage.getString(key)
    return value === undefined ? null : value
  },
  removeItem: (key: string) => {
    storage.delete(key)
  }
}

export let clientPersister = createSyncStoragePersister({
  storage: clientStorage
})
