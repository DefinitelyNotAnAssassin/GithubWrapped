export type GitHubData = {
  profile: {
    name: string
    avatar: string
    bio: string
    followers: number
    following: number
  }
  contributions2024: {
    totalContributions: number
    longestStreak: number
    currentStreak: number
    activeDays: number
    inactiveDays: number
    contributionsPerDay: number
    mostActiveHour: number
    mostActiveDay: {
      date: string
      contributions: number
    }
  }
  repositories: {
    total: number
    created2024: number
    mostStarred: {
      name: string
      stars: number
      description: string
      url: string
    }
    mostCommitted: {
      name: string
      commits: number
      primaryLanguage: string
      url: string
    }
  }
  languages: {
    total: number
    breakdown: {
      name: string
      bytes: number
      percentage: number
    }[]
  }
  activity: {
    totalCommits: number
    commitHeatmap: {
      day: string
      count: number
    }[]
  }
}
