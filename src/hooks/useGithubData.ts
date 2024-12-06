import { GitHubData } from "@/types/GitHubData"

const GET_USER_DATA = `
  query GetUserData($username: String!) {
    user(login: $username) {
      name
      bio
      avatarUrl
      followers {
        totalCount
      }
      following {
        totalCount
      }
      contributionsCollection(
        from: "2024-01-01T00:00:00Z"
        to: "2024-12-31T23:59:59Z"
      ) {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
      repositories(first: 100, ownerAffiliations: OWNER) {
        totalCount
        nodes {
          name
          description
          stargazerCount
          url
          createdAt
          primaryLanguage {
            name
          }
          languages(first: 10) {
            totalSize
            edges {
              size
              node {
                name
              }
            }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(
                  since: "2024-01-01T00:00:00Z"
                  until: "2024-12-31T23:59:59Z"
                ) {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`

export const useGitHubData = async (
  username: string
): Promise<GitHubData | null> => {
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token `,
      },
      body: JSON.stringify({
        query: GET_USER_DATA,
        variables: { username },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const graphqlData = await response.json()

    if (graphqlData.errors) {
      throw new Error(graphqlData.errors.map((e: any) => e.message).join(", "))
    }

    const user = graphqlData.data.user
    const contributionDays =
      user.contributionsCollection.contributionCalendar.weeks
        .flatMap((week: any) => week.contributionDays)
        .filter((day: any) => day.contributionCount > 0)

    const totalDays = 366 // 2024 is a leap year
    const activeDays = contributionDays.length
    const inactiveDays = totalDays - activeDays

    let longestStreak = 0
    let currentStreak = 0
    let streakCount = 0

    for (let i = 0; i < contributionDays.length; i++) {
      if (
        i === 0 ||
        new Date(contributionDays[i].date).getTime() -
          new Date(contributionDays[i - 1].date).getTime() ===
          86400000
      ) {
        streakCount++
      } else {
        longestStreak = Math.max(longestStreak, streakCount)
        streakCount = 1
      }
    }
    currentStreak = streakCount
    longestStreak = Math.max(longestStreak, currentStreak)

    const totalContributions =
      user.contributionsCollection.contributionCalendar.totalContributions
    const contributionsPerDay = totalContributions / totalDays

    const contributionsByHour = new Array(24).fill(0)
    contributionDays.forEach((day: any) => {
      const hour = new Date(day.date).getHours()
      contributionsByHour[hour] += day.contributionCount
    })
    const mostActiveHour = contributionsByHour.indexOf(
      Math.max(...contributionsByHour)
    )

    const mostActiveDay = contributionDays.reduce((max: any, day: any) =>
      day.contributionCount > max.contributionCount ? day : max
    )

    const reposCreatedIn2024 = user.repositories.nodes.filter(
      (repo: any) => new Date(repo.createdAt).getFullYear() === 2024
    ).length

    const languageStats: { [key: string]: number } = {}
    user.repositories.nodes.forEach((repo: any) => {
      repo.languages.edges.forEach((edge: any) => {
        const langName = edge.node.name
        languageStats[langName] = (languageStats[langName] || 0) + edge.size
      })
    })

    const totalLanguageBytes = Object.values(languageStats).reduce(
      (a: number, b: number) => a + b,
      0
    )
    const sortedLanguages = Object.entries(languageStats)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalLanguageBytes) * 100,
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 5)

    const mostStarredRepo = user.repositories.nodes.reduce(
      (max: any, repo: any) =>
        repo.stargazerCount > max.stargazerCount ? repo : max,
      { stargazerCount: 0 }
    )

    const mostCommittedRepo = user.repositories.nodes.reduce(
      (max: any, repo: any) => {
        const repoCommits =
          repo.defaultBranchRef?.target?.history?.totalCount || 0
        return repoCommits > max.commits
          ? { ...repo, commits: repoCommits }
          : max
      },
      { commits: 0 }
    )

    const githubData: GitHubData = {
      profile: {
        name: user.name,
        avatar: user.avatarUrl,
        bio: user.bio,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
      },
      contributions2024: {
        totalContributions,
        longestStreak,
        currentStreak,
        activeDays,
        inactiveDays,
        contributionsPerDay,
        mostActiveHour,
        mostActiveDay: {
          date: mostActiveDay.date,
          contributions: mostActiveDay.contributionCount,
        },
      },
      repositories: {
        total: user.repositories.totalCount,
        created2024: reposCreatedIn2024,
        mostStarred: {
          name: mostStarredRepo.name,
          stars: mostStarredRepo.stargazerCount,
          description: mostStarredRepo.description,
          url: mostStarredRepo.url,
        },
        mostCommitted: {
          name: mostCommittedRepo.name,
          commits: mostCommittedRepo.commits,
          primaryLanguage: mostCommittedRepo.primaryLanguage?.name || "Unknown",
          url: mostCommittedRepo.url,
        },
      },
      languages: {
        total: totalLanguageBytes,
        breakdown: sortedLanguages,
      },
      activity: {
        totalCommits: user.contributionsCollection.totalCommitContributions,
        commitHeatmap: user.contributionsCollection.contributionCalendar.weeks
          .flatMap((week: any) => week.contributionDays)
          .map((day: any) => ({
            day: day.date,
            count: day.contributionCount,
          })),
      },
    }

    return githubData
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    throw error
  }
}
