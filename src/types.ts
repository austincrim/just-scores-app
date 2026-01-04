// ============================================================================
// COMMON TYPES (Shared across sports)
// ============================================================================

export type League = {
  id: number
  daily_rollover_offset: number
  daily_rollover_time: string
  default_section: string
  full_name: string
  medium_name: string
  season_type: string
  short_name: string
  slug: string
  sport_name: string
  updated_at: string
  subscription_count: number
  sex: string
  localizations: Record<string, unknown>
  api_uri: string
  resource_uri: string
}

export type Logos = {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: string | null
}

export type SubscribableAlert = {
  key: string
  display: string
  default: boolean
}

export type Colours = {
  away: string
  home: string
}

export type Progress = {
  clock_label: string
  string: string
  status: string
  event_status: string
  segment: number | null
  segment_string: string | null
  segment_description: string | null
  clock: string
  overtime: boolean
}

export type Odd = {
  away_odd: string
  home_odd: string
  id: number
  line: string
  over_under: string
  api_uri: string
  closing?: string
  eu_away_odd?: string
  eu_home_odd?: string
  eu_over_under?: string
}

export type Standing = {
  api_uri: string
  streak: string
  conference: string
  conference_abbreviation: string | null
  conference_seed: number | null
  division: string | null
  last_five_games_record?: string
  last_ten_games_record?: string
  place: number
  short_record: string
  conference_rank: number | null
  division_rank: number | null
  division_seed: number | null
  division_ranking?: number
  formatted_rank: string | null
  short_away_record?: string
  short_home_record?: string
  short_conference_record?: string
  short_division_record?: string
  short_ats_record: string | null
}

export type HeadShots = {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export type Player = {
  api_uri: string
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  headshots: HeadShots
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  resource_uri: string
  subscription_count: number
  updated_at: string
  teams: Team[]
}

export type Team = {
  abbreviation: string
  api_uri: string
  colour_1: string
  colour_2: string
  conference: string
  division: string
  full_name: string
  has_extra_info: boolean
  has_injuries: boolean
  has_rosters: boolean
  id: number
  location: string
  logos: Logos
  medium_name: string
  name: string
  resource_uri: string
  rss_url?: string
  search_name: string
  short_name: string
  standing?: Standing
  sub_division?: string | null
  subscribable_alert_text?: string
  subscribable_alerts: SubscribableAlert[]
  subscription_count: number
  updated_at: string
  payroll_url?: string
}

// ============================================================================
// FOOTBALL-SPECIFIC TYPES (NFL & NCAAF)
// ============================================================================

export type ScoringPlay = {
  summary_text: string
  scorer: Player
  team: string
  details?: string
}

export type FootballBoxScore = {
  api_uri: string
  id: number
  minutes: number
  segment_number: number
  down: number | null
  distance?: number | null
  formatted_distance: string | null
  yards_from_goal: number | null
  home_timeouts_left: number | null
  away_timeouts_left: number | null
  under_review: boolean
  field_position: string | null
  has_statistics: boolean
  progress: Progress
  updated_at: string
  score: {
    home: { score: number }
    away: { score: number }
    winning_team: string
    losing_team: string
    tie_game: boolean
  }
  team_in_possession?: { name: string } | null
  last_play?: {
    api_uri: string
    description: string
    event: string
    id: number
    minutes: number
    progress: Progress
    seconds: number
    segment: number
    details?: string
  }
  scoring_summary?: ScoringPlay[]
  attendance?: string
  ball_on?: string
  officiating_crew?: Record<string, string>
  top_performers?: {
    quarterbacks: {
      home: FootballPlayerRecord
      away: FootballPlayerRecord
    }
    running_backs?: {
      home: FootballPlayerRecord
      away: FootballPlayerRecord
    }
    receivers?: {
      home: FootballPlayerRecord
      away: FootballPlayerRecord
    }
    receiver_breakdowns?: {
      home: Array<{
        label: string
        receiving_yards: number
        percentage_of_total_receiving_yards: number
      }>
      away: Array<{
        label: string
        receiving_yards: number
        percentage_of_total_receiving_yards: number
      }>
    }
  }
}

export type FootballPlayerRecord = {
  alignment: string
  api_uri: string
  defensive_assists: number
  defensive_dive: number
  defensive_forced_fumbles: number
  defensive_fumble_return_touchdowns: number | null
  defensive_fumble_return_yards: number | null
  defensive_fumbles_recovered: number
  defensive_interception_return_touchdowns: number
  defensive_interception_return_yards: number
  defensive_interceptions: number
  defensive_passes_defended: number
  defensive_pressures: number
  defensive_sack_yards: number
  defensive_sacks: number
  defensive_safeties: number | null
  defensive_sp_assists: number | null
  defensive_sp_tackles: number | null
  defensive_stuff_yards: number | null
  defensive_stuffs: number
  defensive_tackles: number
  defensive_tackles_assists: number
  defensive_tackles_total: number
  defensive_touchdown_total: number
  field_goals_attempted: number
  field_goals_blocked: number | null
  field_goals_long: number
  field_goals_made: number
  fumbles: number | null
  fumbles_forced: number
  fumbles_lost: number
  fumbles_opponent_recovered: number
  fumbles_opponent_recovered_touchdowns: number | null
  fumbles_opponent_recovered_yards: number | null
  fumbles_own_recovered: number
  fumbles_own_recovered_touchdowns: number | null
  fumbles_own_recovered_yards: number | null
  id: number
  interceptions: number
  interceptions_touchdowns: number
  interceptions_yards: number
  interceptions_yards_long: number
  kick_return_touchdowns: number | null
  kick_return_yards: number | null
  kick_return_yards_average: string
  kick_return_yards_long: number | null
  kick_returns: number | null
  kicking_blocked_extra_points: number | null
  kicking_extra_points_attempted: number | null
  kicking_extra_points_made: number | null
  passing_attempts: number
  passing_completions: number
  passing_completion_percentage?: number
  passing_interceptions: number
  passing_rating: number | null
  passing_sacks: number
  passing_touchdowns: number
  passing_yards: number
  passing_yards_long: number
  passing_yards_per_attempt: number
  passing_yards_lost: number
  pat_attempted: number
  pat_blocked: number | null
  pat_made: number
  player: Player
  position_types: string[]
  punt_return_touchdowns: number | null
  punt_return_yards: number | null
  punt_return_yards_average: string
  punt_return_yards_long: number | null
  punt_returns: number | null
  punts: number
  punts_average: number
  punts_blocked: number | null
  punts_inside_20: number
  punts_net_average: number | null
  punts_touchbacks: number
  punts_yards: number
  punts_yards_long: number
  receiving_receptions: number
  receiving_targets: number
  receiving_touchdowns: number
  receiving_yards: number
  receiving_yards_average: string
  receiving_yards_long: number
  return_touchdowns: number
  return_yards: number
  rushing_attempts: number
  rushing_touchdowns: number
  rushing_yards: number
  rushing_yards_average: string
  rushing_yards_long: number
  team: string
  updated_at: string
}

export type NFLEvent = {
  api_uri: string
  away_ranking: null
  away_team: Team
  betradar_id: string
  bet_works_id: null
  bowl: null
  box_score: FootballBoxScore
  colours: Colours
  display_fpi: boolean
  event_details: EventDetail[]
  event_status: string
  game_date: string
  game_description: null
  game_type: string
  has_play_by_play_records: boolean
  has_team_twitter_handles: boolean
  home_ranking: null
  home_team: Team
  id: number
  important: null
  league: League
  location: string
  odd: Odd
  preview?: string
  preview_data?: Record<string, unknown>
  red_zone: boolean
  recap?: string
  recap_data?: {
    abstract: string
    headline: string
  }
  resource_uri: string
  season_week: string
  stadium: string
  standings: Standing | null
  status: string
  stubhub_url: null
  subscribable_alerts: SubscribableAlert[]
  tba: boolean
  top_match: null
  total_quarters: null
  tv_listings_by_country_code: TvListingsByCountryCode
  updated_at: string
  week: number
}

export type NcaaFBEvent = {
  api_uri: string
  away_ranking: null
  away_team: Team
  betradar_id: string
  bet_works_id: null
  bowl: null
  box_score: FootballBoxScore
  colours: Colours
  conference_names: string[]
  display_fpi: boolean
  event_details: EventDetail[]
  event_status: string
  game_date: string
  game_description: null
  game_type: string
  has_play_by_play_records: boolean
  has_team_twitter_handles: boolean
  home_ranking: null
  home_team: Team
  id: number
  important: boolean
  league: League
  location: string
  odd: Odd
  red_zone: boolean
  resource_uri: string
  season_week: string
  stadium: string
  standings: Standing | null
  status: string
  stubhub_url: null
  subscribable_alerts: SubscribableAlert[]
  tba: boolean
  top_25_rankings: Colours
  top_match: null
  total_quarters: number
  tv_listings_by_country_code: TvListingsByCountryCode
  updated_at: string
  week: number
}

// ============================================================================
// BASKETBALL-SPECIFIC TYPES (NBA & NCAAB)
// ============================================================================

export type BasketballBoxScore = {
  api_uri: string
  id: number
  progress: Progress
  score: {
    home: { score: number }
    away: { score: number }
    winning_team: string
    losing_team: string
    tie_game: boolean
  }
  updated_at: string
  has_statistics: boolean
  referees: any
  event: {
    api_uri: string
  }
  home_timeouts_left: number | null
  away_timeouts_left: number | null
  attendance: number | null
  total_segments: number
  line_scores: {
    home: Array<{
      team_fouls: number | null
      api_uri: string
      id: number
      score: number
      segment: number
      segment_string: string
      updated_at: string
    }>
    away: Array<{
      team_fouls: number | null
      api_uri: string
      id: number
      score: number
      segment: number
      segment_string: string
      updated_at: string
    }>
  }
  share_url: string
  team_records: {
    home: {
      wins: number
      losses: number
    }
    away: {
      wins: number
      losses: number
    }
  }
  last_play?: {
    api_uri: string
    description: string
    event: string
    id: number
    minutes: number
    progress: Progress
    seconds: number
    segment: number
  }
}

export type BasketballPlayerRecord = {
  alignment: string
  api_uri: string
  assists: number
  blocked_shots: number
  box_score: string
  dnp_details: any
  dnp_reason: any
  dnp_type: any
  ejections_player: number
  field_goals_attempted: number
  field_goals_made: number
  field_goals_percentage: string
  flagrant_fouls: number
  free_throws_attempted: number
  free_throws_made: number
  free_throws_percentage: string | null
  games_started: number
  id: number
  minutes: number
  on_court: boolean
  personal_fouls: number
  personal_fouls_disqualifications: any
  player: Player
  plus_minus: number
  points: number
  position: string
  rebounds_defensive: number
  rebounds_offensive: number
  rebounds_total: number
  started_game: boolean
  steals: number
  team: string
  technical_fouls_player: number
  three_point_field_goals_attempted: number
  three_point_field_goals_made: number
  three_point_field_goals_percentage: string
  total_seconds: number
  turnovers: number
  updated_at: string
}

export type NcaaBBEvent = {
  api_uri: string
  away_conference: string
  away_ranking: number
  away_team: Team
  betradar_id: string
  bet_works_id: null
  box_score: BasketballBoxScore
  colours: Colours
  conference_names: string[]
  event_details: EventDetail[]
  event_status: string
  game_date: string
  game_description: null
  game_type: string
  has_play_by_play_records: boolean
  has_team_twitter_handles: boolean
  home_conference: string
  home_ranking: number
  home_team: Team
  id: number
  if_necessary: boolean
  important: boolean
  league: League
  location: string
  odd: Odd
  resource_uri: string
  slot: null
  standings?: Standing
  status: string
  stubhub_url: null
  subscribable_alerts: SubscribableAlert[]
  tba: boolean
  top_25_rankings: Record<string, unknown>
  top_match: null
  tournament_name: null
  tv_listings_by_country_code: TvListingsByCountryCode
  updated_at: string
}

// ============================================================================
// MISC SHARED TYPES
// ============================================================================

export type EventDetail = {
  description: string
  // Add more fields as needed based on API responses
}

export type TvListing = {
  channel?: string
  provider?: string
  long_name: string
}

export type TvListingsByCountryCode = {
  us?: TvListing[]
  [key: string]: TvListing[] | undefined
}

// ============================================================================
// MULTISPORT TYPES
// ============================================================================

export type MultisportLeagueData = {
  league: League
  events: Game[]
}

export type MultisportResponse = {
  [leagueSlug: string]: MultisportLeagueData
}

// ============================================================================
// UNION TYPES
// ============================================================================

export type Game = NcaaBBEvent | NcaaFBEvent | NFLEvent
export type BoxScore = FootballBoxScore | BasketballBoxScore
export type PlayerRecord = FootballPlayerRecord | BasketballPlayerRecord
