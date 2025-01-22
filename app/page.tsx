"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Rocket, Atom, Trophy } from "lucide-react"
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface LeaderboardEntry {
  rank: number
  name: string
  score: number
}

interface User {
  full_name: string
  best_score: number
}

export default function RegistrationPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [validRegistration, setValidRegistration] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
    return phoneRegex.test(number)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value
    setValidRegistration(true)
    setPhoneNumber(number)
    setIsValid(validatePhoneNumber(number))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    console.log(phoneNumber)
    try {
      const response = await axios.post('https://my-guessing-number-lbhc.vercel.app/api/register.js', {
        phoneNumber,
      })

      if (response.data.isRegistered) {
        console.log(response.data.user)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('bestScore', response.data.best_score.toString())
          sessionStorage.setItem('phoneNumber', response.data.phoneNumber)
          sessionStorage.setItem('name', response.data.user)
        }
        router.push('/play')
      } else {
        setValidRegistration(false)
      }
    } catch (error) {
      console.error('Error checking registration:', error)
      setError('An error occurred while checking registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/register')
  }

  const handleLeaderboard = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('https://my-guessing-number-lbhc.vercel.app/api/handle-leaderboard.js')
      console.log(response.data)
      
      if (response.data.topUsers && Array.isArray(response.data.topUsers)) {
        const leaderboardData: LeaderboardEntry[] = response.data.topUsers.map((user: User, index: number) => ({
          rank: index + 1,
          name: user.full_name,
          score: user.best_score
        }))
        
        setLeaderboard(leaderboardData)
        setIsDialogOpen(true)
        console.log('Leaderboard fetched successfully:', leaderboardData)
      } else {
        throw new Error('Invalid leaderboard data received')
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      setError('Failed to fetch leaderboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-8 space-y-6 border border-indigo-500">
        <div className="text-center">
          <Rocket className="mx-auto text-indigo-400" size={48} aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-bold text-indigo-300">Cosmic Number Quest</h1>
          <p className="mt-2 text-gray-300">Log in to continue your galactic adventure!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
              Intergalactic Communication Code
            </label>
            <div className="relative">
              <Atom className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your 10-digit quantum ID"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className={`pl-10 bg-gray-700 text-white border-gray-600 ${isValid ? 'border-green-500' : ''}`}
                aria-invalid={!isValid}
                aria-describedby={!isValid ? "phone-error" : undefined}
              />
            </div>
            {phoneNumber && !isValid && (
              <p id="phone-error" className="text-sm text-red-400">Please enter a valid quantum ID.</p>
            )}
            {isValid && !validRegistration && (
              <p className="text-sm text-red-400">You are not registered in our galactic database. Please register or enter a valid code.</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            disabled={loading}
          >
            {loading ? 'Initiating...' : 'Initiate Login Sequence'}
          </Button>
        </form>

        <Button onClick={handleRegister}
          type="button"
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
        >
          Join the Cosmic Alliance
        </Button>
        <Button onClick={handleLeaderboard}
          type="button"
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          disabled={loading}
        >
          <Trophy className="mr-2" size={20} aria-hidden="true" />
          {loading ? 'Loading...' : 'View Galactic Leaderboard'}
        </Button>

        {error && (
          <p className="text-sm text-red-400 mt-2" role="alert">{error}</p>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-indigo-300">Galactic Leaderboard</DialogTitle>
              <DialogDescription className="text-gray-300">Top cosmic adventurers across the universe!</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-indigo-300 pb-2">Rank</th>
                    <th className="text-left text-indigo-300 pb-2">Name</th>
                    <th className="text-right text-indigo-300 pb-2">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-t border-gray-700">
                      <td className="py-2 font-medium">{entry.rank}</td>
                      <td className="py-2">{entry.name}</td>
                      <td className="py-2 text-right">{entry.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsDialogOpen(false)} className="bg-indigo-500 hover:bg-indigo-600">Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
