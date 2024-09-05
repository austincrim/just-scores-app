import { useQuery } from "@tanstack/react-query"
import { Game } from "@/types"

export const API_URL = "https://api.thescore.com"
export const POWER = [
  "Top 25",
  "ACC",
  "Big 12",
  "Big Ten",
  "SEC",
  "All FBS",
  "All FCS",
]
const POWER_ORDER = new Map(POWER.map((item, index) => [item, index]))

export function useSchedule(
  sport: "ncaaf" | "ncaab" | "nfl",
  conference?: string,
  week?: string,
) {
  return useQuery({
    queryKey: [sport, conference, week],
    queryFn: async () => {
      let [leaguesRes, scheduleRes] = await Promise.all([
        fetch(`${API_URL}/${sport}/events/conferences`),
        fetch(
          `${API_URL}/${sport}/schedule?utc_offset=-21600&conference=${
            conference ?? ""
          }`,
        ),
      ])

      let leagues: League[] | null = null
      let conferences: string[] = []
      if (!leaguesRes.ok) {
        if (leaguesRes.status === 404) {
          leagues = null
        } else {
          let message = await leaguesRes.text()
          console.error(message)
          throw new Error(message)
        }
      } else {
        leagues = await leaguesRes.json()
        conferences = leagues ? leagues.flatMap((l) => l.conferences) : []
      }

      if (!scheduleRes.ok) {
        let message = await scheduleRes.text()
        console.error(message)
        throw new Error(message)
      }

      let events = (await scheduleRes.json()) as {
        current_season: Season[]
        current_group: Season
      }

      let games: Game[] = []
      let weekToFetch = week
        ? events.current_season.find((w: any) => w.id === week)
        : events.current_group

      if (weekToFetch?.event_ids && weekToFetch?.event_ids.length) {
        let gamesRes = await fetch(
          `${API_URL}/${sport}/events?id.in=${weekToFetch.event_ids.join(",")}`,
        )

        games = await gamesRes.json()
      }

      return {
        conferences,
        events,
        games,
      }
    },
    select: (data) => {
      data.games.sort(
        (a, b) =>
          new Date(a.game_date).valueOf() - new Date(b.game_date).valueOf(),
      )
      data.conferences.sort((a, b) => {
        const aIndex = POWER_ORDER.get(a)
        const bIndex = POWER_ORDER.get(b)

        // If both elements are in POWER, sort by their order in POWER
        if (aIndex !== undefined && bIndex !== undefined) {
          return aIndex - bIndex
        }

        // If only 'a' is in POWER, it should come first
        if (aIndex !== undefined) return -1

        // If only 'b' is in POWER, it should come first
        if (bIndex !== undefined) return 1

        // If neither is in POWER, sort alphabetically
        return a.localeCompare(b)
      })
      return data
    },
    refetchInterval: 5000,
  })
}

export type League = {
  name: string | undefined
  conferences: string[]
}

export type Season = {
  label: string
  id: string
  event_ids: number[]
}
