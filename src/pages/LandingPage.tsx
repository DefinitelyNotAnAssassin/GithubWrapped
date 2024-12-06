'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Github, Gift, Code, Star } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()    
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      navigate(`/wrapped/${username}`)
    }
}

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-[#101010] p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="inline-block"
        >
          <Github className="w-24 h-24 text-white mb-6" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl font-bold text-white mb-4"
        >
          GitHub Wrapped 2024
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl text-gray-300"
        >
          Unwrap your coding journey of 2024
        </motion.p>
      </motion.div>

      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-md mb-8"
      >
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-grow text-white bg-gray-800 border-gray-700"
          />
          <Button type="submit" className="bg-green-500 text-white hover:bg-green-600">
            <Search className="w-4 h-4 mr-2" />
            Unwrap
          </Button>
        </div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
      >
        <Feature icon={<Code className="w-8 h-8 mb-2" />} title="Code Stats" description="Total lines of code, commits, and more" />
        <Feature icon={<Star className="w-8 h-8 mb-2" />} title="Top Projects" description="Your most starred and forked repositories" />
        <Feature icon={<Gift className="w-8 h-8 mb-2" />} title="2024 Highlights" description="Your coding milestones and achievements" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-8 text-gray-400 text-sm text-center"
      >
        Discover your GitHub journey in 2024. Enter a username to view their wrapped summary.
      </motion.p>
    </div>
  )
}

function Feature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="text-green-500 flex justify-center">{icon}</div>
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

