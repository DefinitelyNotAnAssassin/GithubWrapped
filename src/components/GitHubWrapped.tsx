'use client'

import { useState, useEffect } from 'react'
import { useGitHubData } from '@/hooks/useGithubData'
import { GitHubData } from '@/types/GitHubData'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ProfileStory,
  TotalRepositoriesStory,
  MostStarredRepositoryStory,
  MostCommittedRepositoryStory,
  TotalCommitsStory,
  MostCommitsInOneDayStory,
  LongestStreakStory,
  ActiveDaysStory,
  MostActiveDayHourStory,
  LanguagesBreakdownStory,
  EndingStory
} from './StoryComponents'


const STORY_DURATION = 5000 // 5 seconds per story

export default function GitHubWrappedStories() {
  const username = location.pathname.split('/').pop() || ''
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStory, setCurrentStory] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const storedData = localStorage.getItem(username)
      if (storedData) {
        setData(JSON.parse(storedData))
        setLoading(false)
      } else {
        try {
          const result = await useGitHubData(username)
          setData(result)
          localStorage.setItem(username, JSON.stringify(result))
        } catch (err) {
          setError('Failed to fetch GitHub data')
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [username])
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isPaused && data) {
      intervalId = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStory(current => {
              if (current < stories.length - 1) {
                return current + 1;
              } else {
                setIsPaused(true);
                return current;
              }
            });
            return 0;
          }
          return prev + (100 / (STORY_DURATION / 50));
        });
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isPaused, data]);

  
  const stories = [
    {
      title: "Profile",
      component: ProfileStory,
      backgroundColor: "from-gray-900 to-gray-700"
    },
    {
      title: "Total Repositories Created",
      component: TotalRepositoriesStory,
      backgroundColor: "from-blue-900 to-blue-700"
    },
    {
      title: "Most Starred Repository",
      component: MostStarredRepositoryStory,
      backgroundColor: "from-green-900 to-green-700"
    },
    {
      title: "Most Committed Repository",
      component: MostCommittedRepositoryStory,
      backgroundColor: "from-purple-900 to-purple-700"
    },
    {
      title: "Total Commits",
      component: TotalCommitsStory,
      backgroundColor: "from-indigo-900 to-indigo-700"
    },
    {
      title: "Most Commits in One Day",
      component: MostCommitsInOneDayStory,
      backgroundColor: "from-red-900 to-red-700"
    },
    {
      title: "Longest Streak",
      component: LongestStreakStory,
      backgroundColor: "from-yellow-900 to-yellow-700"
    },
    {
      title: "Active and Inactive Days",
      component: ActiveDaysStory,
      backgroundColor: "from-gray-900 to-gray-700"
    },
    {
      title: "Most Active Day and Hour",
      component: MostActiveDayHourStory,
      backgroundColor: "from-teal-900 to-teal-700"
    },
    {
      title: "Languages Breakdown",
      component: LanguagesBreakdownStory,
      backgroundColor: "from-orange-900 to-orange-700"
    },
    {
      title: "Here's to 2024!",
      component: EndingStory,
      backgroundColor: "from-gray-900 to-gray-700"
    }
  ];


  const handleNextStory = () => {
    setCurrentStory(current => 
      current < stories.length - 1 ? current + 1 : 0
    );
    setProgress(0);
  };

  const handlePrevStory = () => {
    setCurrentStory(current => 
      current > 0 ? current - 1 : stories.length - 1
    );
    setProgress(0);
  };

  if (loading) return <LoadingStory />
  if (error) return <ErrorStory message={error} />
  if (!data) return <div className="flex justify-center items-center h-screen">No data available</div>


  return (
    <div className={`min-h-screen flex flex-col justify-center items-center bg-gradient-to-br ${stories[currentStory].backgroundColor} p-4 overflow-hidden`}>
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3 }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <motion.circle
            cx="50%"
            cy="50%"
            r="30%"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>
      </motion.div>
      <div className="w-[90vw]  relative z-10 ">
        {/* Progress Bar */}
        <motion.div 
          className="top-0 left-0 right-0 h-1 bg-white/30 z-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-white" 
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </motion.div>

        {/* Story Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          {stories.map((_, index) => (
            <motion.div 
              key={index} 
              className={`h-1 flex-1 mx-1 ${
                index < currentStory ? 'bg-white' : 
                index === currentStory ? 'bg-white/50' : 'bg-white/20'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}
        </div>

        {/* Story Controls */}
        <motion.div 
          className="absolute top-4 right-4 z-20"

        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsPaused(prev => !prev)}
            className="text-white hover:bg-white/20"
          >
            {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </Button>
        </motion.div>

        {/* Story Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStory}
          
            exit={{ opacity: 0, y: -50, rotateX: 15 }}
            className=" z-10 h-[75vh] w-full  perspective-1000"
            transition={{ duration: 1 }}
          >
            {stories[currentStory].component({ data })}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div 
          className="absolute top-1/2 z-50 transform -translate-y-1/2 w-full flex justify-between"
         
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrevStory}
            className="text-white hover:bg-white/20 z-50 cursor-pointer"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextStory}
            className="text-white hover:bg-white/20 z-40"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}


function LoadingStory() {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div className="text-center">
        <div className="loader mx-auto mb-4"></div>
        <p className="text-xl">Generating Your GitHub Wrapped...</p>
      </div>
      <style>{`
        .loader {
          border: 4px solid rgba(255,255,255,0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function ErrorStory({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-900 to-red-700 text-white">
      <div className="text-center p-6 bg-white/10 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Oops!</h2>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  )
}



