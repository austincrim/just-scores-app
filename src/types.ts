export type NcaaFBEvent = {
  bowl: null
  important: boolean
  location: string
  season_week: string
  stadium: string
  total_quarters: number
  colours: Colours
  conference_names: string[]
  has_play_by_play_records: boolean
  stubhub_url: null
  week: number
  home_ranking: null
  away_ranking: null
  id: number
  event_status: string
  game_date: string
  game_type: string
  game_description: null
  tba: boolean
  updated_at: string
  bet_works_id: null
  betradar_id: string
  top_match: null
  status: string
  api_uri: string
  resource_uri: string
  away_team: FBTeam
  home_team: FBTeam
  red_zone: boolean
  top_25_rankings: Colours
  display_fpi: boolean
  league: League
  event_details: EventDetail[]
  tv_listings_by_country_code: TvListingsByCountryCode
  has_team_twitter_handles: boolean
  standings: Standings
  box_score: FBBoxScore
  odd: Odd
  subscribable_alerts: SubscribableAlert[]
}

export type NcaaBBEvent = {
  important: boolean
  location: string
  stadium: string
  away_conference: string
  home_conference: string
  colours: Colours
  conference_names: string[]
  has_play_by_play_records: boolean
  stubhub_url: null
  if_necessary: boolean
  away_ranking: number
  home_ranking: number
  id: number
  event_status: string
  game_date: string
  game_type: string
  game_description: null
  tba: boolean
  updated_at: string
  bet_works_id: null
  betradar_id: string
  top_match: null
  status: string
  api_uri: string
  resource_uri: string
  away_team: BBTeam
  home_team: BBTeam
  top_25_rankings: Top25_Rankings
  league: League
  event_details: EventDetail[]
  tv_listings_by_country_code: TvListingsByCountryCode
  has_team_twitter_handles: boolean
  box_score: BBBoxScore
  odd: Odd
  subscribable_alerts: SubscribableAlert[]
  slot: null
  tournament_name: null
}

export type NFLEvent = {
  bowl: null
  important: null
  location: string
  season_week: string
  stadium: string
  total_quarters: null
  colours: Colours
  has_play_by_play_records: boolean
  stubhub_url: null
  week: number
  home_ranking: null
  away_ranking: null
  id: number
  event_status: string
  game_date: string
  game_type: string
  game_description: null
  tba: boolean
  updated_at: string
  bet_works_id: null
  betradar_id: string
  top_match: null
  status: string
  api_uri: string
  resource_uri: string
  away_team: FBTeam
  home_team: FBTeam
  red_zone: boolean
  display_fpi: boolean
  league: League
  preview: string
  preview_data: PreviewData
  event_details: EventDetail[]
  tv_listings_by_country_code: TvListingsByCountryCode
  has_team_twitter_handles: boolean
  standings: null
  box_score: FBBoxScore
  odd: Odd
  subscribable_alerts: SubscribableAlert[]
}

export type Game = NcaaBBEvent | NcaaFBEvent | NFLEvent
export type BBBoxScore = {
  api_uri: string
  id: number
  progress: Progress
  last_play: {
    api_uri: string
    description: string
    event: string
    id: number
    minutes: number
    progress: Progress
    seconds: number
    segment: number
  }
  score: {
    home: {
      score: number
    }
    away: {
      score: number
    }
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
  home_timeouts_left: any
  away_timeouts_left: any
  attendance: any
  total_segments: number
  line_scores: {
    home: Array<{
      team_fouls: any
      api_uri: string
      id: number
      score: number
      segment: number
      segment_string: string
      updated_at: string
    }>
    away: Array<{
      team_fouls: any
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
    home: BBRecord
    away: BBRecord
  }
}
export type BBTeam = {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos
  subscribable_alerts: SubscribableAlert[]
  subscribable_alert_text: string
}

export type Logos = {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: null
}

export type SubscribableAlert = {
  key: string
  display: string
  default: boolean
}

export type Progress = {
  clock_label: string
  string: string
  status: string
  event_status: string
  segment: null
  segment_string: null
  segment_description: null
  clock: string
  overtime: boolean
}

export type BBScore = {
  home: {
    score: number
  }
  away: {
    score: number
  }
  tie_game: boolean
}

export type Colours = {
  away: string
  home: string
}

export type EventDetail = {
  label: string
  content: string
  identifier: string
}

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
  localizations: Localizations
  api_uri: string
  resource_uri: string
}

export type Localizations = {}

export type Odd = {
  away_odd: string
  home_odd: string
  id: number
  line: string
  over_under: string
  api_uri: string
}

export type Standings = {
  away: StandingsAway
  home: StandingsAway
}

export type StandingsAway = {
  streak: string
  conference: string
  conference_abbreviation: string
  conference_seed: number
  division: null
  last_ten_games_record: string
  place: number
  short_record: string
  conference_rank: number
  division_rank: null
  division_seed: null
  formatted_rank: string
  short_away_record: string
  short_home_record: string
  api_uri: string
  conference_ranking: number
  division_ranking: number
}

export type Top25_Rankings = {
  home: number
  away: number
}

export type TvListingsByCountryCode = {
  us: TvListing[]
}

export type TvListing = {
  short_name: string
  long_name: string
}

export type NcaaBBEventStats = {
  referees: null
  home_timeouts_left: null
  away_timeouts_left: null
  id: number
  has_statistics: boolean
  progress: Progress
  updated_at: string
  event: Event
  api_uri: string
  line_scores: LineScores
  score: BBScore
  share_url: string
  team_records: MatchupRecords
  attendance: null
  total_segments: number
  last_play: LastPlay
}

export type Event = {
  location: string
  stadium: string
  away_conference: string
  home_conference: string
  colours: Colours
  conference_names: string[]
  has_play_by_play_records: boolean
  stubhub_url: null
  if_necessary: boolean
  away_ranking: null
  home_ranking: number
  id: number
  event_status: string
  game_date: string
  game_type: string
  game_description: string
  tba: boolean
  updated_at: string
  bet_works_id: null
  betradar_id: string
  top_match: null
  status: string
  api_uri: string
  resource_uri: string
  away_team: BBTeam
  home_team: BBTeam
  top_25_rankings: Top25_Rankings
  league: League
  preview: string
  preview_data: PreviewData
  event_details: EventDetail[]
  tv_listings_by_country_code: TvListingsByCountryCode
  has_team_twitter_handles: boolean
  standings: Standings
}

export type PreviewData = {
  abstract: string
  headline: string
}

export type LineScores = {
  home: Array<{
    team_fouls: null
    id: number
    score: number
    segment: number
    segment_string: string
    updated_at: string
    api_uri: string
  }>
  away: Array<{
    team_fouls: null
    id: number
    score: number
    segment: number
    segment_string: string
    updated_at: string
    api_uri: string
  }>
}

export type MatchupRecords = {
  home: BBRecord
  away: BBRecord
}

export type BBRecord = {
  assists: number
  biggest_lead: number
  blocked_shots: number
  defensive_3_seconds: null
  dunks: null
  ejections_coach: null
  ejections_player: number
  fast_break_points: number
  field_goals_attempted: number
  field_goals_made: number
  flagrant_fouls: number
  free_throws_attempted: number
  free_throws_made: number
  hooks: null
  id: number
  illegal_defense: null
  jumpshots: null
  layups: null
  minutes: number
  personal_fouls: number
  personal_fouls_disqualifications: number
  points: number
  points_in_paint: number
  points_off_turnovers: number
  rebounds_dead_ball: null
  rebounds_defensive: number
  rebounds_offensive: number
  rebounds_team: number
  rebounds_team_def: null
  rebounds_team_off: null
  rebounds_total: number
  second_change_points: number
  steals: number
  team_offensive_rebounds: null
  team_defensive_rebounds: null
  technical_fouls_bench: null
  technical_fouls_coach: number
  technical_fouls_player: number
  technical_fouls_team: null
  three_point_field_goals_attempted: number
  three_point_field_goals_made: number
  tipins: null
  turnovers: number
  turnovers_team: number
  updated_at: string
  api_uri: string
  field_goals_percentage: string
  free_throws_percentage: string
  three_point_field_goals_percentage: string
}

export interface FBBoxScore {
  distance: number
  down: number
  formatted_distance: string
  under_review: boolean
  field_position: string
  minutes: number
  segment_number: number
  yards_from_goal: number
  home_timeouts_left: number
  away_timeouts_left: number
  id: number
  has_statistics: boolean
  progress: Progress
  updated_at: string
  event: Event
  api_uri: string
  line_scores: LineScores
  score: FBScore
  share_url: string
  team_records: TeamRecords
  scoring_summary: ScoringSummary[]
  team_in_possession: TeamInPossession
  attendance: any
  ball_on: string
  officiating_crew: OfficiatingCrew
  last_play: LastPlay
  top_performers: TopPerformers
}

export interface Home {
  id: number
  score: number
  segment: number
  segment_string: string
  updated_at: string
  api_uri: string
}

export interface Away {
  id: number
  score: number
  segment: number
  segment_string: string
  updated_at: string
  api_uri: string
}

export interface FBScore {
  home: {
    score: number
  }
  away: {
    score: number
  }
  winning_team: string
  losing_team: string
  tie_game: boolean
}

export interface TeamRecords {
  home: FBRecord
  away: FBRecord
}

export interface FBRecord {
  assists: number
  average_yards: number
  extra_points_attempts: number
  extra_points_blocked: number
  extra_points_made: number
  extra_points_percent: number
  field_goals_attempts: number
  field_goals_blocked: number
  field_goals_made: number
  field_goals_percent: number
  first_downs_number: number
  first_downs_passing: number
  first_downs_penalty: number
  first_downs_rushing: number
  forced_fumbles: number
  fourth_down_attempts: number
  fourth_down_made: number
  fourth_down_percent: number
  fumbles: number
  fumbles_lost: number
  fumbles_opponent_recovered: number
  fumbles_opponent_tds: number
  fumbles_opponent_yards: number
  fumbles_own_rec_tds: number
  fumbles_own_rec_yards: number
  fumbles_own_recovered: number
  goal_to_go_attempts: number
  goal_to_go_made: number
  goal_to_go_percent: number
  id: number
  interception_return_attempts: number
  interception_return_long: any
  interception_return_tds: number
  interception_return_yards: number
  kick_return_attempts: any
  kick_return_long: number
  kick_return_tds: number
  kick_return_yards: number
  kickoffs: number
  kickoffs_end_zone: number
  kickoffs_touchbacks: number
  net_yards: number
  passes_defensed: number
  passing_attempts: number
  passing_average: number
  passing_completions: number
  passing_interceptions: number
  passing_net_yards: number
  passing_sacked: number
  passing_tds: number
  passing_yards_lost: any
  penalties: number
  penalty_yards: number
  plays: number
  punt_return_attempts: number
  punt_return_long: number
  punt_return_tds: number
  punt_return_yards: number
  punting_average: number
  punting_punts: number
  punting_yards: number
  red_zone_attempts: number
  red_zone_made: number
  red_zone_percent: number
  return_total_tds: number
  return_total_yards: number
  rushing_attempts: number
  rushing_average: number
  rushing_tds: number
  rushing_yards: number
  sack_yards: number
  sacks: number
  safeties: number
  tackles: number
  third_down_attempts: number
  third_down_made: number
  third_down_percent: number
  time_in_possession: string
  time_of_possession_minutes: number
  time_of_possession_seconds: number
  two_point_conversions_attempts: number
  two_point_conversions_made: number
  two_point_conversions_percent: number
  updated_at: string
  api_uri: string
  box_score: string
}

export interface ScoringSummary {
  distance: number
  drive_minutes: number
  drive_plays: number
  drive_seconds: number
  drive_yards: number
  half: any
  minutes: number
  ordinal: number
  pat_good: boolean
  pat_points: number
  pat_type: number
  quarter: number
  score_type: number
  score_type_description: string
  score_type_season_total_for_scorer: number
  score_type_season_total_for_passer: number
  summary_text: string
  seconds: number
  segment: number
  updated_at: string
  scorer: Scorer
  passer: Passer
  pat_player: PatPlayer
  pat_passer: any
  team: string
  api_uri: string
  drive: string
}

export interface Scorer {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: FBTeam[]
}

export interface Headshots {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface FBTeam {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos
  rss_url: string
  standing: Standing
  subscribable_alerts: SubscribableAlert[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Standing {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface Passer {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots2
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team2[]
}

export interface Headshots2 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team2 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos2
  rss_url: string
  standing: Standing2
  subscribable_alerts: SubscribableAlert2[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos2 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing2 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert2 {
  key: string
  display: string
  default: boolean
}

export interface PatPlayer {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots3
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team3[]
}

export interface Headshots3 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team3 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos3
  rss_url: string
  standing: Standing3
  subscribable_alerts: SubscribableAlert3[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos3 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing3 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert3 {
  key: string
  display: string
  default: boolean
}

export interface TeamInPossession {
  medium_name: string
  short_name: string
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  api_uri: string
  resource_uri: string
  logos: Logos4
}

export interface Logos4 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface OfficiatingCrew {
  referee: string
  umpire: string
  head_linesman: string
  line_judge: string
  field_judge: string
  side_judge: string
  back_judge: string
  replay_official: string
}

export interface LastPlay {
  away_score_after: number
  away_score_before: number
  continuation: boolean
  direction: any
  down: number
  header: string
  home_score_after: number
  home_score_before: number
  id: number
  minutes: number
  play_type: string
  progress: Progress2
  quarter: number
  seconds: number
  segment: number
  updated_at: string
  distance: number
  score: Score2
  player1: Player1
  player2: any
  player3: any
  tackle1: Tackle1
  tackle2: any
  api_uri: string
  details: string
  end_possession: string
  event: string
  possession: string
  team_uri: string
  yards: number
  field_position: FieldPosition
  end_yardline: string
  yardline: string
}

export interface Progress2 {
  clock_label: string
  string: string
  status: string
  event_status: string
  segment: number
  segment_string: string
  segment_description: string
  clock: string
  overtime: boolean
}

export interface Score2 {
  away: number
  home: number
  short_summary: string
  string: string
}

export interface Player1 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots4
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team4[]
}

export interface Headshots4 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team4 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos5
  rss_url: string
  standing: Standing4
  subscribable_alerts: SubscribableAlert4[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos5 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing4 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert4 {
  key: string
  display: string
  default: boolean
}

export interface Tackle1 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots5
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team5[]
}

export interface Headshots5 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team5 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos6
  rss_url: string
  standing: Standing5
  subscribable_alerts: SubscribableAlert5[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos6 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing5 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert5 {
  key: string
  display: string
  default: boolean
}

export interface FieldPosition {
  absolute_yardlines: AbsoluteYardlines
  start_yardline: string
  end_yardline: string
  label: string
}

export interface AbsoluteYardlines {
  away: Away4
  home: Home4
}

export interface Away4 {
  start: number
  end: number
}

export interface Home4 {
  start: number
  end: number
}

export interface TopPerformers {
  quarterbacks: Quarterbacks
  running_backs: RunningBacks
  receivers: Receivers
  receiver_breakdowns: ReceiverBreakdowns
}

export interface Quarterbacks {
  home: Home5
  away: Away5
}

export interface Home5 {
  passing_attempts: number
  passing_completions: number
  passing_completion_percentage: number
  passing_interceptions: number
  passing_rating: number
  passing_sacks: number
  passing_touchdowns: number
  passing_yards_long: number
  passing_yards_per_attempt: number
  passing_yards: number
  player: Player
  api_uri: string
}

export interface Player {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots6
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team6[]
}

export interface Headshots6 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team6 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos7
  rss_url: string
  standing: Standing6
  subscribable_alerts: SubscribableAlert6[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos7 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing6 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert6 {
  key: string
  display: string
  default: boolean
}

export interface Away5 {
  passing_attempts: number
  passing_completions: number
  passing_completion_percentage: number
  passing_interceptions: number
  passing_rating: number
  passing_sacks: number
  passing_touchdowns: number
  passing_yards_long: number
  passing_yards_per_attempt: number
  passing_yards: number
  player: Player2
  api_uri: string
}

export interface Player2 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots7
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team7[]
}

export interface Headshots7 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team7 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos8
  rss_url: string
  standing: Standing7
  subscribable_alerts: SubscribableAlert7[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos8 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing7 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert7 {
  key: string
  display: string
  default: boolean
}

export interface RunningBacks {
  home: Home6
  away: Away6
}

export interface Home6 {
  fumbles_lost: number
  receiving_receptions: number
  receiving_yards: number
  rushing_attempts: number
  rushing_touchdowns: number
  rushing_yards: number
  rushing_yards_average: string
  rushing_yards_per_attempt: number
  rushing_yards_long: number
  player: Player3
  api_uri: string
}

export interface Player3 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots8
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team8[]
}

export interface Headshots8 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team8 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos9
  rss_url: string
  standing: Standing8
  subscribable_alerts: SubscribableAlert8[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos9 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing8 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert8 {
  key: string
  display: string
  default: boolean
}

export interface Away6 {
  fumbles_lost: number
  receiving_receptions: number
  receiving_yards: number
  rushing_attempts: number
  rushing_touchdowns: number
  rushing_yards: number
  rushing_yards_average: string
  rushing_yards_per_attempt: number
  rushing_yards_long: number
  player: Player4
  api_uri: string
}

export interface Player4 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots9
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team9[]
}

export interface Headshots9 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team9 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos10
  rss_url: string
  standing: Standing9
  subscribable_alerts: SubscribableAlert9[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos10 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing9 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert9 {
  key: string
  display: string
  default: boolean
}

export interface Receivers {
  home: Home7
  away: Away7
}

export interface Home7 {
  receiving_receptions: number
  receiving_targets: number
  receiving_touchdowns: number
  receiving_yards: number
  receiving_yards_average: string
  player: Player5
  api_uri: string
}

export interface Player5 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots10
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team10[]
}

export interface Headshots10 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team10 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos11
  rss_url: string
  standing: Standing10
  subscribable_alerts: SubscribableAlert10[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos11 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing10 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert10 {
  key: string
  display: string
  default: boolean
}

export interface Away7 {
  receiving_receptions: number
  receiving_targets: number
  receiving_touchdowns: number
  receiving_yards: number
  receiving_yards_average: string
  player: Player6
  api_uri: string
}

export interface Player6 {
  first_initial_and_last_name: string
  first_name: string
  full_name: string
  headshots: Headshots11
  id: number
  last_name: string
  number: number
  position: string
  position_abbreviation: string
  subscription_count: number
  updated_at: string
  has_headshots: boolean
  has_transparent_headshots: boolean
  api_uri: string
  resource_uri: string
  teams: Team11[]
}

export interface Headshots11 {
  original: string
  w192xh192: string
  large: string
  small: string
  transparent_large: string
  transparent_medium: string
  transparent_small: string
}

export interface Team11 {
  colour_1: string
  colour_2: string
  division: string
  full_name: string
  name: string
  search_name: string
  location: string
  short_name: string
  conference: string
  has_injuries: boolean
  has_rosters: boolean
  has_extra_info: boolean
  updated_at: string
  subscription_count: number
  id: number
  abbreviation: string
  medium_name: string
  api_uri: string
  resource_uri: string
  logos: Logos12
  rss_url: string
  standing: Standing11
  subscribable_alerts: SubscribableAlert11[]
  subscribable_alert_text: string
  payroll_url: string
}

export interface Logos12 {
  large: string
  small: string
  w72xh72: string
  tiny: string
  facing: any
}

export interface Standing11 {
  last_five_games_record: string
  short_record: string
  streak: string
  short_ats_record: any
  short_away_record: string
  short_conference_record: string
  short_division_record: string
  short_home_record: string
  conference_rank: any
  conference_seed: number
  division_rank: number
  division_seed: any
  formatted_rank: string
  conference: string
  conference_abbreviation: any
  division: string
  place: number
  api_uri: string
  division_ranking: number
}

export interface SubscribableAlert11 {
  key: string
  display: string
  default: boolean
}

export interface ReceiverBreakdowns {
  home: Home8[]
  away: Away8[]
}

export interface Home8 {
  label: string
  receiving_yards: number
  percentage_of_total_receiving_yards: number
}

export interface Away8 {
  label: string
  receiving_yards: number
  percentage_of_total_receiving_yards: number
}

export type FootballPlayerRecord = {
  alignment: string
  api_uri: string
  box_score: string
  defensive_assists: number
  defensive_blocked_kicks: number
  defensive_misc_assists: number | null
  defensive_misc_tackles: number | null
  defensive_passes: number | null
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
  passing_interceptions: number
  passing_rating: number | null
  passing_sacks: number
  passing_touchdowns: number
  passing_yards: number
  passing_yards_long: number
  passing_yards_lost: number
  pat_attempted: number
  pat_blocked: number | null
  pat_made: number
  player: {
    api_uri: string
    first_initial_and_last_name: string
    first_name: string
    full_name: string
    has_headshots: boolean
    has_transparent_headshots: boolean
    headshots: {
      large: string
      original: string
      small: string
      transparent_large: string
      transparent_medium: string
      transparent_small: string
      w192xh192: string
    }
    id: number
    last_name: string
    number: number
    position: string
    position_abbreviation: string
    resource_uri: string
    subscription_count: number
    teams: Array<{
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
      logos: {
        facing: string | null
        large: string
        small: string
        tiny: string
        w72xh72: string
      }
      medium_name: string
      name: string
      resource_uri: string
      rss_url: string
      search_name: string
      short_name: string
      subscribable_alert_text: string
      subscribable_alerts: Array<{
        default: boolean
        display: string
        key: string
      }>
      subscription_count: number
      updated_at: string
    }>
    updated_at: string
  }
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
  free_throws_percentage: any
  games_started: number
  id: number
  minutes: number
  on_court: boolean
  personal_fouls: number
  personal_fouls_disqualifications: any
  player: {
    api_uri: string
    first_initial_and_last_name: string
    first_name: string
    full_name: string
    has_headshots: boolean
    has_transparent_headshots: boolean
    headshots: {
      large: string
      original: string
      small: string
      transparent_large: string
      transparent_medium: string
      transparent_small: string
      w192xh192: string
    }
    id: number
    last_name: string
    number: number
    position: string
    position_abbreviation: string
    resource_uri: string
    subscription_count: number
    teams: Array<{
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
      logos: {
        facing: string | null
        large: string
        small: string
        tiny: string
        w72xh72: string
      }
      medium_name: string
      name: string
      resource_uri: string
      rss_url: string
      search_name: string
      short_name: string
      subscribable_alert_text: string
      subscribable_alerts: Array<{
        default: boolean
        display: string
        key: string
      }>
      subscription_count: number
      updated_at: string
    }>
    updated_at: string
  }
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

export type BasketballBoxScore = {
  home: BasketballPlayerRecord[]
  away: BasketballPlayerRecord[]
}

export type FootballBoxScore = {
  home: FootballPlayerRecord[]
  away: FootballPlayerRecord[]
}
