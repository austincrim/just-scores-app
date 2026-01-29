import { useQuery } from "@tanstack/react-query"
import { Game, LiveLeaguesResponse } from "@/types"

export const API_URL = "https://api.thescore.com"
export const SPORTS = ["nfl", "ncaaf", "ncaab"] as const
export type Sport = (typeof SPORTS)[number]

export type AllSportsGames = {
  nfl: Game[]
  ncaaf: Game[]
  ncaab: Game[]
}

const POWER_4_CONFERENCES = [
  "Atlantic Coast",
  "Big 12",
  "Big Ten",
  "Southeastern",
]

type TeamInfo = { id: number; conference: string }
type Power4TeamIds = { ncaaf: Set<number>; ncaab: Set<number> }
let power4TeamIds: Power4TeamIds | null = null

async function fetchPower4TeamIds(): Promise<Power4TeamIds> {
  if (power4TeamIds) return power4TeamIds

  try {
    const [ncaafRes, ncaabRes] = await Promise.all([
      fetch(`${API_URL}/ncaaf/teams`),
      fetch(`${API_URL}/ncaab/teams`),
    ])

    const ncaafTeams: TeamInfo[] = ncaafRes.ok ? await ncaafRes.json() : []
    const ncaabTeams: TeamInfo[] = ncaabRes.ok ? await ncaabRes.json() : []

    const ncaafIds = new Set<number>()
    const ncaabIds = new Set<number>()

    for (const team of ncaafTeams) {
      if (POWER_4_CONFERENCES.includes(team.conference)) {
        ncaafIds.add(team.id)
      }
    }
    for (const team of ncaabTeams) {
      if (POWER_4_CONFERENCES.includes(team.conference)) {
        ncaabIds.add(team.id)
      }
    }

    power4TeamIds = { ncaaf: ncaafIds, ncaab: ncaabIds }
  } catch (e) {
    console.error("Failed to fetch Power 4 team IDs:", e)
    power4TeamIds = { ncaaf: new Set(), ncaab: new Set() }
  }

  return power4TeamIds
}

type GameWithRankings = Game & {
  home_ranking?: number | null
  away_ranking?: number | null
}

function isPower4OrRankedGame(
  game: GameWithRankings,
  teamIds: Set<number>,
): boolean {
  const isRanked =
    (game.home_ranking != null && game.home_ranking <= 25) ||
    (game.away_ranking != null && game.away_ranking <= 25)
  const isPower4 =
    teamIds.has(game.home_team?.id) || teamIds.has(game.away_team?.id)
  return isRanked || isPower4
}

type NcaaSport = "ncaaf" | "ncaab"

export function useAllSportsGames(date: string) {
  return useQuery({
    queryKey: ["multisport", "all", date],
    refetchInterval: 5000,
    queryFn: async () => {
      try {
        const startDate = new Date(`${date}T06:00:00.000Z`)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 1)

        const dateParam = `${startDate.toISOString()},${endDate.toISOString()}`

        const [gamesRes, teamIds] = await Promise.all([
          fetch(
            `${API_URL}/multisport/events?leagues=nfl,ncaaf,ncaab&game_date.in=${dateParam}`,
          ),
          fetchPower4TeamIds(),
        ])

        if (!gamesRes.ok) {
          console.error("multisport fetch failed:", await gamesRes.text())
          return { nfl: [], ncaaf: [], ncaab: [] } as AllSportsGames
        }

        const data = (await gamesRes.json()) as Record<
          string,
          { events: Game[] }
        >
        const result: AllSportsGames = { nfl: [], ncaaf: [], ncaab: [] }

        for (const sport of SPORTS) {
          let events = data[sport]?.events ?? []
          if (sport === "ncaaf" || sport === "ncaab") {
            const sportTeamIds = teamIds[sport as NcaaSport]
            events = events.filter((g) =>
              isPower4OrRankedGame(g as GameWithRankings, sportTeamIds),
            )
          }
          events.sort(
            (a, b) =>
              new Date(a.game_date).valueOf() - new Date(b.game_date).valueOf(),
          )
          result[sport] = events
        }

        return result
      } catch (e) {
        console.error("useAllSportsGames error:", e)
        return { nfl: [], ncaaf: [], ncaab: [] } as AllSportsGames
      }
    },
  })
}
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
      try {
        if (events && events.length) {
          let gamesRes = await fetch(
            `${API_URL}/${sport}/events?id.in=${events.join(",")}`,
          )

          games = await gamesRes.json()
        }
      } catch (e) {
        console.error(e)
        return []
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

export function useFavoritesGames(teamIds: number[]) {
  return useQuery({
    queryKey: ["multisport", "favorites", teamIds],
    refetchInterval: 5000,
    enabled: teamIds.length > 0,
    queryFn: async () => {
      if (!teamIds.length) return { games: [] as Game[], teamIds: [] }

      const now = new Date()
      const startDate = new Date(now)
      const endDate = new Date(now)
      endDate.setUTCDate(endDate.getUTCDate() + 7)

      const startDateStr = startDate.toISOString().split("T")[0]
      const endDateStr = endDate.toISOString().split("T")[0]
      const dateParam = `${startDateStr},${endDateStr}`

      try {
        let res = await fetch(
          `${API_URL}/multisport/events?leagues=nfl,ncaaf,ncaab&game_date.in=${dateParam}`,
        )
        if (!res.ok) {
          console.error(await res.text())
          return { games: [] as Game[], teamIds }
        }

        let data = (await res.json()) as Record<string, { events: Game[] }>
        let allGames: Game[] = []
        Object.values(data).forEach((league) => {
          if (league.events) {
            allGames.push(...league.events)
          }
        })

        // Filter to only games where a favorite team is playing
        const filteredGames = allGames.filter(
          (game) =>
            teamIds.includes(game.home_team?.id) ||
            teamIds.includes(game.away_team?.id),
        )

        filteredGames.sort(
          (a, b) =>
            new Date(a.game_date).valueOf() - new Date(b.game_date).valueOf(),
        )

        return { games: filteredGames, teamIds }
      } catch (e) {
        console.error(e)
        return { games: [] as Game[], teamIds }
      }
    },
  })
}

export function useLiveLeagues() {
  return useQuery({
    queryKey: ["meta", "leagues", "live"],
    refetchInterval: 30000,
    queryFn: async () => {
      let res = await fetch(`${API_URL}/meta/leagues/live`)
      if (!res.ok) {
        console.error(await res.text())
        return []
      }
      return (await res.json()) as LiveLeaguesResponse
    },
    select: (data) => {
      const sports = ["nfl", "ncaaf", "ncaab"] as const
      return Object.fromEntries(
        sports.map((sport) => [
          sport,
          data.find((l) => l.league === sport)?.in_progress_event_count ?? 0,
        ]),
      ) as Record<(typeof sports)[number], number>
    },
  })
}
