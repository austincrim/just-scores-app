# TheScore API Documentation

Base URL: `https://api.thescore.com`

## Schedule & Seasons

### GET `/{sport}/schedule`
Returns current season info with weeks/groups and all season types (preseason, regular, postseason).
- **Params**: `utc_offset` (optional)
- **Response**: Object with `current_season` (array) and `current_group` (current week)
- **Sports**: `nfl`, `ncaaf`, `ncaab`

## Events (Games)

### GET `/multisport/events`
Fetches events across multiple sports in a single request.
- **Params**:
  - `leagues` (required, comma-separated: `nfl,nba,nhl,mlb,epl,ncaaf,ncaab`, etc.)
  - `game_date.in` (required, comma-separated ISO timestamps for date range)
  - `team_id` (optional, filter by team ID - single or comma-separated)
  - `limit` (optional, results per league)
  - `status` (optional, filter by status: `pre_game`, `in_progress`, `final`)
  - `sort` (optional)
  - `rpp` (optional, results per page)
- **Response**: Object with league keys containing `league` metadata and `events` array
- **Note**: Requires at least 2 dates in `game_date.in`

### GET `/{sport}/events/{eventId}`
Fetches detailed info for a single event.
- **Response**: Full event object with teams, scores, box_score, tv_listings, etc.

### GET `/{sport}/events`
Fetches multiple events with filtering.
- **Params**: 
  - `team_id` (filter by team - returns all historical games, 300+)
  - `id.in` (comma-separated event IDs)
  - `conference` (NCAA only)
  - `utc_offset` (optional)
- **Response**: Array of event objects

### GET `/{sport}/teams/{teamId}/events/full_schedule`
Fetches current season schedule for a specific team. Only returns regular season + preseason (typically 17-21 games for NFL).
- **Response**: Array of event objects for current season only
- **Sports**: `nfl`, `ncaaf`, `ncaab`
- **Preferred over**: `/events?team_id=X` for season filtering

### GET `/{sport}/events/{eventId}/play_by_play_records`
Fetches play-by-play records for an event.
- **Response**: Array of play record objects with description, progress, segment, team info
- **Note**: Check `game.has_play_by_play_records` before fetching

### GET `/{sport}/events/conferences`
Lists all conferences for a sport.
- **Response**: Array of conference objects with `name` and `conferences` array
- **Sports**: `ncaaf`, `ncaab` (NFL returns 404)

## Box Scores

### GET `/{sport}/box_scores/{boxScoreId}/player_records`
Fetches individual player stats for a game.
- **Response**: Array of player record objects with stats
- **Note**: Use `game.box_score.id` from event data

## Teams

### GET `/{sport}/teams`
Lists all teams for a sport.
- **Params**: `name` (optional, search filter - still returns all teams)
- **Response**: Array of team objects with logo URLs, coach info, stadium, etc.

### GET `/{sport}/teams/{teamId}`
Fetches detailed info for a single team.
- **Response**: Team object with extra_info, payroll_url, scoring_breakdown, etc.

## Standings

### GET `/{sport}/standings`
Fetches all standings entries for a sport.
- **Params**: `team_id` (optional, filter by team - NFL supports this)
- **Response**: Array of standing objects with W-L record, conference info, division rank, etc.
- **Note**: NCAA standings endpoint does NOT support `team_id` filter

## Team Info

### GET `/{sport}/teams/{teamId}/injuries`
Fetches injury report for a team.
- **Response**: Array of injury objects

---

## Meta

### GET `/meta/leagues/live`
Returns live event counts across all leagues and conferences.
- **Response**: Array of objects with `league` slug, `in_progress_event_count`, and `conferences` array (with conference name and count)
- **Use case**: Quickly check which leagues/conferences have games in progress

---

## Known Limitations

- `/{sport}/teams/{teamId}/rosters` - Returns 404 error
- `/{sport}/teams/{teamId}/standing` - Returns 404 error (use `/standings` with `team_id` filter instead)
- `/{sport}/teams/{teamId}/stats` - Returns 404 error
- `/{sport}/standings?team_id=X` - Works for NFL, but NOT for NCAA sports
- Events endpoint does not support `season_id` query parameter for filtering
