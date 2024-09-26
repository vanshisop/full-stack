"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, ThumbsUp, Atom, Zap, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const lowMessages = [
  "Too low. Increase your quantum energy!",
  "Not quite there. The number exists in a higher dimension!",
  "You're in the subatomic realm. Scale up to the macro level!",
  "Think bigger! The number is oscillating at a higher frequency.",
  "Nice try, but our quantum number is in a higher energy state!"
]

const highMessages = [
  "Too high. Reduce your particle velocity!",
  "Whoa, you've overshot! Descend from the quantum realm.",
  "You're among the quasars. Our number is closer to the event horizon!",
  "Easy there, time traveler! The number is in an earlier epoch.",
  "Great enthusiasm, but let's collapse that wave function a bit."
]

export default function QuantumNumberQuest() {
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [guess, setGuess] = useState<string>("")
  const [feedback, setFeedback] = useState<string>("")
  const [attempts, setAttempts] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [lastMessageIndex, setLastMessageIndex] = useState<number>(-1)
  
  const [userValue, setUserValue] = useState<string>("")
  const [bestScore, setBestScore] = useState<number>(0)
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = sessionStorage.getItem('name')
      const storedBestScore = sessionStorage.getItem('bestScore')
      const storedPhoneNumber = sessionStorage.getItem('phoneNumber')

      if (!storedName || !storedBestScore || !storedPhoneNumber) {
        router.replace('/')
      } else {
        setUserValue(storedName)
        setBestScore(Number(storedBestScore))
        setPhoneNumber(storedPhoneNumber)
        setTargetNumber(Math.floor(Math.random() * 1000))
      }
    }
  }, [router])

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * 1000))
    setGuess("")
    setFeedback("")
    setAttempts(0)
    setGameOver(false)
  }

  const getRandomMessage = (messages: string[], lastIndex: number): string => {
    let newIndex: number
    do {
      newIndex = Math.floor(Math.random() * messages.length)
    } while (newIndex === lastIndex && messages.length > 1)
    setLastMessageIndex(newIndex)
    return messages[newIndex]
  }

  const handleGuess = async () => {
    const guessNumber = parseInt(guess)
  
    if (isNaN(guessNumber) || guessNumber < 0 || guessNumber > 999) {
      setFeedback("Please enter a valid quantum state between 0 and 999.")
      return 
    }

    setAttempts(prevAttempts => prevAttempts + 1)
  
    if (guessNumber === targetNumber) {
      setFeedback(`Eureka! You've discovered the quantum state in ${attempts + 1} observations.`)
      setGameOver(true)
      
      if (attempts + 1 < bestScore || bestScore === 0) {
        const newBestScore = attempts + 1
        setBestScore(newBestScore)
        sessionStorage.setItem('bestScore', newBestScore.toString())

        try {
          const response = await axios.post('https://my-guessing-app-71ffba160115.herokuapp.com/update-scores', {
            phoneNumber, score: newBestScore
          })
  
          if (response.data.isUpdated) {
            console.log("Update Successful")
          } else {
            console.log("Update Unsuccessful")
          }
        } catch (error) {
          console.error('Error updating scores:', error)
        }
      }
    } else if (guessNumber < targetNumber) {
      setFeedback(getRandomMessage(lowMessages, lastMessageIndex))
    } else {
      setFeedback(getRandomMessage(highMessages, lastMessageIndex))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 999)) {
      setGuess(value)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black p-4 text-gray-200 overflow-hidden">
      <Atom className="absolute top-10 left-10 text-blue-400 animate-pulse" size={48} aria-hidden="true" />
      <Zap className="absolute bottom-10 right-10 text-yellow-400 animate-bounce" size={48} aria-hidden="true" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-8 space-y-6 relative z-10 border border-indigo-500"
      >
        <h1 className="text-4xl font-bold text-center text-indigo-400">
          Quantum Number Quest
        </h1>
        
        <div className="text-center text-xl font-semibold text-indigo-300">
          Greetings, Quantum Explorer {userValue}!
        </div>

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-indigo-400">
            <Trophy className="inline mr-2" size={20} aria-hidden="true" />
            Best Observation: {bestScore === 0 ? "-" : bestScore}
          </div>
          <div className="text-lg font-semibold text-indigo-400">
            Attempts: {attempts}
          </div>
        </div>
        
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Enter quantum state (0-999)"
            value={guess}
            onChange={handleInputChange}
            min={0}
            max={999}
            disabled={gameOver}
            className="text-lg bg-gray-700 border-indigo-500 text-white placeholder-gray-400"
            aria-label="Enter your guess"
          />
          <Button 
            onClick={handleGuess} 
            disabled={gameOver || guess === ""}
            className="w-full text-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-white"
          >
            <Atom className="mr-2" size={20} aria-hidden="true" /> Observe Quantum State
          </Button>
        </div>

        <div className="h-20 overflow-hidden">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback}
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className={`p-4 rounded-md ${gameOver ? "bg-green-800 text-green-200" : "bg-indigo-800 text-indigo-200"}`}
              >
                <p className="text-center text-lg">
                  {gameOver ? <ThumbsUp className="inline mr-2" aria-hidden="true" /> : <AlertCircle className="inline mr-2" aria-hidden="true" />}
                  {feedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {gameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button onClick={startNewGame} className="w-full text-lg bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
              Initiate New Quantum Experiment
            </Button>
          </motion.div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-lg border-indigo-500 text-indigo-400 hover:bg-indigo-900">
              Quantum Protocols
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-indigo-400">
                Quantum Number Quest Protocols
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>A quantum number between 0 and 999 exists in a superposition.</li>
                  <li>Your mission is to collapse the wave function with as few observations as possible.</li>
                  <li>After each observation, you will be informed if your guess represents a higher or lower energy state.</li>
                  <li>Only quantum states between 0 and 999 are valid in this dimension.</li>
                  <li>Continue observing until you identify the correct quantum state.</li>
                  <li>The experiment concludes when you successfully collapse the wave function.</li>
                  <li>You can initiate a new quantum experiment at any time by clicking <b>Initiate New Quantum Experiment</b>.</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}