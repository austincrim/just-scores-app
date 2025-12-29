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
) {
  return useQuery({
    queryKey: [sport, conference],
    refetchInterval: 10000,
    queryFn: async () => {
      let scheduleRes = await fetch(
        `${API_URL}/${sport}/schedule?utc_offset=-21600&conference=${
          conference ?? ""
        }`,
      )
      if (!scheduleRes.ok) {
        let message = await scheduleRes.text()
        console.error(message)
        throw new Error(message)
      }

      let events = (await scheduleRes.json()) as {
        current_season: Season[]
        current_group: Season
      }

      return events
    },
  })
}

export function useConferences(sport: "ncaaf" | "ncaab" | "nfl") {
  return useQuery({
    queryKey: [sport, "conferences"],
    select: (data) => {
      data.sort((a, b) => {
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
    queryFn: async () => {
      if (sport !== "ncaaf" && sport !== "ncaab") return Promise.resolve([])

      let leaguesRes = await fetch(`${API_URL}/${sport}/events/conferences`)

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

      return conferences
    },
  })
}

export function useGames(sport: string, events: Array<number>) {
  return useQuery({
    queryKey: [sport, events],
    refetchInterval: 5000,
    select: (data) => {
      data.sort(
        (a, b) =>
          new Date(a.game_date).valueOf() - new Date(b.game_date).valueOf(),
      )
      return data
    },
    queryFn: async () => {
      let games: Game[] = []
      if (events && events.length) {
        let gamesRes = await fetch(
          `${API_URL}/${sport}/events?id.in=${events.join(",")}`,
        )

        games = await gamesRes.json()
      }
      return games
    },
  })
}

export type League = {
  name: string | undefined
  conferences: string[]
}

export type Season = {
  label: string
  id: string
  guid: string
  event_ids: number[]
}

export function useTeamSchedule(
  sport: "ncaaf" | "ncaab" | "nfl",
  teamId: number,
) {
  return useQuery({
    queryKey: [sport, "team", teamId],
    queryFn: async () => {
      let scheduleRes = await fetch(
        `${API_URL}/${sport}/teams/${teamId}/events/full_schedule`,
      )
      if (!scheduleRes.ok) {
        let message = await scheduleRes.text()
        console.error(message)
        throw new Error(message)
      }

      let events = (await scheduleRes.json()) as Game[]
      return events
    },
  })
}

export type TeamStanding = {
  wins: number
  losses: number
  ties?: number
  short_record: string
  conference?: string
}

export function useTeamStanding(
  sport: "ncaaf" | "ncaab" | "nfl",
  teamId: number,
) {
  return useQuery({
    queryKey: [sport, "standing", teamId],
    refetchInterval: 30000,
    queryFn: async () => {
      // Only NFL supports team_id filter reliably
      if (sport === "nfl") {
        let standingsRes = await fetch(
          `${API_URL}/${sport}/standings?team_id=${teamId}`,
        )
        if (!standingsRes.ok) {
          console.error(await standingsRes.text())
          return null
        }
        let standings = (await standingsRes.json()) as TeamStanding[]
        return standings[0] || null
      }

      // For NCAA, fetch all and filter
      let standingsRes = await fetch(`${API_URL}/${sport}/standings`)
      if (!standingsRes.ok) {
        console.error(await standingsRes.text())
        return null
      }
      let standings = (await standingsRes.json()) as any[]
      return standings.find((s) => s.team?.id === teamId) || null
    },
  })
}
