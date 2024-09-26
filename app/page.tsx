'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Rocket, ArrowLeft } from "lucide-react"

export default function PlayPage() {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [targetNumber, setTargetNumber] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [name, setName] = useState('')
  const [bestScore, setBestScore] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Generate a random number between 1 and 100
    setTargetNumber(Math.floor(Math.random() * 100) + 1)

    // Safely access sessionStorage on the client side
    if (typeof window !== 'undefined') {
      const storedName = sessionStorage.getItem('name')
      const storedBestScore = sessionStorage.getItem('bestScore')
      if (storedName) setName(storedName)
      if (storedBestScore) setBestScore(parseInt(storedBestScore, 10))
    }
  }, [])

  const handleGuess = () => {
    const guessNumber = parseInt(guess, 10)
    setAttempts(attempts + 1)

    if (guessNumber === targetNumber) {
      setMessage('Congratulations! You guessed the number!')
      setGameOver(true)
      // Update best score if needed
      if (attempts + 1 < bestScore || bestScore === 0) {
        setBestScore(attempts + 1)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('bestScore', (attempts + 1).toString())
        }
      }
    } else if (guessNumber < targetNumber) {
      setMessage('Too low! Try a higher number.')
    } else {
      setMessage('Too high! Try a lower number.')
    }

    setGuess('')
  }

  const handleRestart = () => {
    setGuess('')
    setMessage('')
    setAttempts(0)
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGameOver(false)
  }

  const handleExit = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-8 space-y-6 border border-indigo-500">
        <div className="text-center">
          <Rocket className="mx-auto text-indigo-400" size={48} />
          <h1 className="mt-4 text-3xl font-bold text-indigo-300">Cosmic Number Quest</h1>
          <p className="mt-2 text-gray-300">Greetings, {name}! Can you guess the secret number?</p>
        </div>

        <div className="space-y-4">
          <Input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess (1-100)"
            className="w-full bg-gray-700 text-white border-gray-600"
            disabled={gameOver}
          />
          <Button
            onClick={handleGuess}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={gameOver}
          >
            Submit Guess
          </Button>
        </div>

        {message && (
          <p className="text-center text-lg font-semibold text-indigo-300">{message}</p>
        )}

        <p className="text-center text-gray-300">Attempts: {attempts}</p>
        <p className="text-center text-gray-300">Best Score: {bestScore}</p>

        {gameOver && (
          <div className="space-y-4">
            <Button onClick={handleRestart} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Play Again
            </Button>
            <Button onClick={handleExit} className="w-full bg-red-600 hover:bg-red-700 text-white">
              Exit Game
            </Button>
          </div>
        )}

        <Button onClick={handleExit} className="w-full bg-gray-600 hover:bg-gray-700 text-white">
          <ArrowLeft className="mr-2" size={20} />
          Back to Main Menu
        </Button>
      </div>
    </div>
  )
}