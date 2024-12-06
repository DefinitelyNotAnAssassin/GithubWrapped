import { GitHubData } from '@/types/GitHubData'
import { motion } from 'framer-motion'

const staggerChildren = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 5 } }
}
const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
    }

export function TotalRepositoriesStory({ data }: { data: GitHubData }) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Total Repositories Created This Year</h2>
      <p className="text-6xl font-bold">{data.repositories.created2024}</p>
    </div>
  )
}

export function MostStarredRepositoryStory({ data }: { data: GitHubData }) {
  const { name, stars, description } = data.repositories.mostStarred
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Most Starred Repository</h2>
      <p className="text-4xl font-bold mb-2">{name}</p>
      <p className="text-xl mb-4">{stars} stars</p>
      <p className="text-center">{description}</p>
    </div>
  )
}

export function MostCommittedRepositoryStory({ data }: { data: GitHubData }) {
  const { name, commits, primaryLanguage } = data.repositories.mostCommitted
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Most Committed Repository</h2>
      <p className="text-4xl font-bold mb-2">{name}</p>
      <p className="text-xl mb-4">{commits} commits</p>
      <p>Primary Language: {primaryLanguage}</p>
    </div>
  )
}

export function TotalCommitsStory({ data }: { data: GitHubData }) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Total Commits This Year</h2>
      <p className="text-6xl font-bold">{data.activity.totalCommits}</p>
    </div>
  )
}

export function MostCommitsInOneDayStory({ data }: { data: GitHubData }) {
  const { date, contributions } = data.contributions2024.mostActiveDay
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Most Commits in One Day</h2>
      <p className="text-4xl font-bold mb-2">{contributions} commits</p>
      <p className="text-xl">on {new Date(date).toLocaleDateString()}</p>
    </div>
  )
}

export function LongestStreakStory({ data }: { data: GitHubData }) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Longest Streak</h2>
      <p className="text-6xl font-bold">{data.contributions2024.longestStreak} days</p>
    </div>
  )
}

export function ActiveDaysStory({ data }: { data: GitHubData }) {
  const { activeDays, inactiveDays } = data.contributions2024
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Active vs Inactive Days</h2>
      <div className="flex justify-around w-full">
        <div className="text-center">
          <p className="text-4xl font-bold">{activeDays}</p>
          <p>Active Days</p>
        </div>
        <div className="text-center">
          <p className="text-4xl font-bold">{inactiveDays}</p>
          <p>Inactive Days</p>
        </div>
      </div>
    </div>
  )
}

export function MostActiveDayHourStory({ data }: { data: GitHubData }) {
  const { mostActiveDay, mostActiveHour } = data.contributions2024
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Most Active Day and Hour</h2>
      <p className="text-xl mb-4">Most Active Day: {new Date(mostActiveDay.date).toLocaleDateString()}</p>
      <p className="text-xl">Most Active Hour: {mostActiveHour}:00</p>
    </div>
  )
}

export function LanguagesBreakdownStory({ data }: { data: GitHubData }) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Languages Breakdown</h2>
      <div className="w-full">
        {data.languages.breakdown.slice(0, 5).map((lang, index) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between">
              <span>{lang.name}</span>
              <span>{lang.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${lang.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CommitHeatmapStory({ data }: { data: GitHubData }) {
  // This is a simplified heatmap. For a more detailed version, consider using a library like react-calendar-heatmap
  return (
    <div className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-6">Commit Heatmap</h2>
      <div className="grid grid-cols-7 gap-1">
        {data.activity.commitHeatmap.map((day, index) => (
          <div
            key={index}
            className="w-4 h-4 rounded-sm"
            style={{
              backgroundColor: `rgba(255, 255, 255, ${Math.min(day.count / 10, 1)})`
            }}
            title={`${day.day}: ${day.count} commits`}
          />
        ))}
      </div>
    </div>
  )
}

export function ProfileStory({ data }: { data: GitHubData }) {
    return (
      <div className="bg-white/10 h-full rounded-2xl p-6 text-center text-white flex flex-col items-center justify-center">
        <div className="flex justify-centermb-6">
          <img 
            src={data.profile.avatar} 
            alt={data.profile.name} 
            className="w-32 h-32 rounded-full border-4 border-white/30"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">{data.profile.name}</h2>
        <p className="text-white/80 mb-6">{data.profile.bio}</p>
        <div className="flex justify-around">
          <div>
            <p className="text-3xl font-bold">{data.profile.followers}</p>
            <p className="text-white/70">Followers</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{data.profile.following}</p>
            <p className="text-white/70">Following</p>
          </div>
        </div>
      </div>
    )
  }

  export function EndingStory({ data }: { data: GitHubData }) {
    return (
      <motion.div 
        className="bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center justify-center h-full relative overflow-hidden"
        variants={staggerChildren}
        
      >
        <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6 text-center z-10">
          Your 2024 GitHub Journey
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-xl mb-4 text-center z-10">
          You've made {data.contributions2024.totalContributions} contributions across {data.repositories.total} repositories.
        </motion.p>
        <motion.p variants={fadeInUp} className="text-xl mb-6 text-center z-10">
          Your code speaks volumes. Keep pushing those commits!
        </motion.p>
   
        <motion.p variants={fadeInUp} className="text-lg text-center z-10">
          May your code be bug-free and your pull requests be swiftly merged.
        </motion.p>
      
      </motion.div>
    )
  }
  
  