import WidgetKit
import SwiftUI
import ActivityKit

struct GameScoreAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var awayScore: Int
        var homeScore: Int
        var progressString: String
    }

    var awayTeamAbbr: String
    var homeTeamAbbr: String
    var sport: String
    var awayTeamId: Int
    var homeTeamId: Int
    var deepLink: String
}

func teamLogoImage(sport: String, teamId: Int) -> UIImage? {
    guard let containerURL = FileManager.default.containerURL(
        forSecurityApplicationGroupIdentifier: "group.com.austincrim.justscores"
    ) else { return nil }
    let path = containerURL
        .appendingPathComponent("team_logos")
        .appendingPathComponent(sport)
        .appendingPathComponent("\(teamId).png")
        .path
    return UIImage(contentsOfFile: path)
}

func sportIcon(for sport: String) -> String {
    if sport == "nfl" || sport == "ncaaf" {
        return "football.fill"
    }
    return "basketball.fill"
}

struct TeamLogoView: View {
    let sport: String
    let teamId: Int
    let size: CGFloat

    var body: some View {
        if let uiImage = teamLogoImage(sport: sport, teamId: teamId) {
            Image(uiImage: uiImage)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: size, height: size)
                .clipShape(Circle())
        } else {
            Circle()
                .fill(Color.gray.opacity(0.3))
                .frame(width: size, height: size)
        }
    }
}

struct BannerView: View {
    let attributes: GameScoreAttributes
    let state: GameScoreAttributes.ContentState

    var body: some View {
        let awayWinning = state.awayScore > state.homeScore
        let homeWinning = state.homeScore > state.awayScore

        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 4) {
                    TeamLogoView(
                        sport: attributes.sport,
                        teamId: attributes.awayTeamId,
                        size: 28
                    )
                    Text(attributes.awayTeamAbbr)
                        .bold()
                        .foregroundStyle(.white)
                }
                Text("\(state.awayScore)")
                    .font(.system(size: 32))
                    .bold()
                    .foregroundStyle(awayWinning ? .white : .gray)
            }

            Spacer()

            VStack(spacing: 4) {
                Image(systemName: sportIcon(for: attributes.sport))
                    .foregroundStyle(.gray)
                    .font(.system(size: 24))
                Text(state.progressString)
                    .foregroundStyle(.gray)
            }

            Spacer()

            VStack(alignment: .trailing, spacing: 4) {
                HStack(spacing: 4) {
                    Text(attributes.homeTeamAbbr)
                        .bold()
                        .foregroundStyle(.white)
                    TeamLogoView(
                        sport: attributes.sport,
                        teamId: attributes.homeTeamId,
                        size: 28
                    )
                }
                Text("\(state.homeScore)")
                    .font(.system(size: 32))
                    .bold()
                    .foregroundStyle(homeWinning ? .white : .gray)
            }
        }
        .padding(16)
    }
}

struct GameScoreActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: GameScoreAttributes.self) { context in
            Group {
                if let deepLinkURL = URL(string: context.attributes.deepLink) {
                    Link(destination: deepLinkURL) {
                        BannerView(attributes: context.attributes, state: context.state)
                    }
                } else {
                    BannerView(attributes: context.attributes, state: context.state)
                }
            }
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    VStack(spacing: 4) {
                        TeamLogoView(
                            sport: context.attributes.sport,
                            teamId: context.attributes.awayTeamId,
                            size: 32
                        )
                        Text(context.attributes.awayTeamAbbr)
                            .bold()
                            .foregroundStyle(.white)
                        Text("\(context.state.awayScore)")
                            .font(.system(size: 32))
                            .bold()
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(12)
                }

                DynamicIslandExpandedRegion(.trailing) {
                    VStack(spacing: 4) {
                        TeamLogoView(
                            sport: context.attributes.sport,
                            teamId: context.attributes.homeTeamId,
                            size: 32
                        )
                        Text(context.attributes.homeTeamAbbr)
                            .bold()
                            .foregroundStyle(.white)
                        Text("\(context.state.homeScore)")
                            .font(.system(size: 32))
                            .bold()
                            .foregroundStyle(.white)
                    }
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(12)
                }

                DynamicIslandExpandedRegion(.bottom) {
                    VStack {
                        HStack(spacing: 6) {
                            Image(systemName: sportIcon(for: context.attributes.sport))
                                .font(.system(size: 14))
                                .foregroundStyle(.gray)
                            Text(context.state.progressString)
                                .foregroundStyle(.gray)
                            Spacer()
                        }
                    }
                    .padding(.horizontal, 12)
                    .padding(.top, 8)
                    .padding(.bottom, 12)
                }
            } compactLeading: {
                HStack(spacing: 4) {
                    TeamLogoView(
                        sport: context.attributes.sport,
                        teamId: context.attributes.awayTeamId,
                        size: 18
                    )
                    Text(context.attributes.awayTeamAbbr)
                        .font(.system(size: 12, weight: .semibold))
                    Text("\(context.state.awayScore)")
                        .font(.system(size: 14, weight: .bold))
                }
            } compactTrailing: {
                HStack(spacing: 4) {
                    Text("\(context.state.homeScore)")
                        .font(.system(size: 14, weight: .bold))
                    Text(context.attributes.homeTeamAbbr)
                        .font(.system(size: 12, weight: .semibold))
                    TeamLogoView(
                        sport: context.attributes.sport,
                        teamId: context.attributes.homeTeamId,
                        size: 18
                    )
                }
            } minimal: {
                Text("\(context.state.awayScore)-\(context.state.homeScore)")
                    .font(.system(size: 11, weight: .bold))
            }
            .widgetURL(URL(string: context.attributes.deepLink))
        }
    }
}
