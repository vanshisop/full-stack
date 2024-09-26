"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Atom, User, Cpu } from "lucide-react"
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function QuantumRegistrationPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [quantumID, setQuantumID] = useState("")
  const [isQuantumIDValid, setIsQuantumIDValid] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ title: "", description: "" })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateQuantumID = (id: string) => {
    const quantumIDRegex = /^\d{10}$/
    return quantumIDRegex.test(id)
  }

  const handleQuantumIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantumID = e.target.value
    setQuantumID(newQuantumID)
    setIsQuantumIDValid(validateQuantumID(newQuantumID))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (firstName && lastName && isQuantumIDValid) {
      setIsLoading(true)
      const name = `${firstName} ${lastName}`
      
      try {
        const response = await axios.post('https://my-guessing-app-71ffba160115.herokuapp.com/handle-registration', {
          best_score: 0,
          name: name,
          phone: quantumID
        })
      
        if (response.data.isRegistered) {
          sessionStorage.setItem('bestScore', "0")
          sessionStorage.setItem('phoneNumber', quantumID)
          sessionStorage.setItem('name', name)
          router.push('/play')
        } else {
          setDialogContent({
            title: "Quantum ID Already Exists",
            description: "Please select a new Quantum ID for multiversal uniqueness."
          })
          setIsDialogOpen(true)
        }
      } catch (error) {
        console.error('Registration error:', error)
        setDialogContent({
          title: "Quantum Entanglement Error",
          description: "An error occurred during registration. Please try again."
        })
        setIsDialogOpen(true)
      } finally {
        setIsLoading(false)
      }
    } else {
      setDialogContent({
        title: "Quantum Registration Failed",
        description: "Please fill in all fields correctly to initialize your quantum state."
      })
      setIsDialogOpen(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 via-indigo-900 to-black">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-8 space-y-6 border border-indigo-500">
        <div className="text-center">
          <Atom className="mx-auto text-blue-400 animate-pulse" size={48} aria-hidden="true" />
          <h1 className="mt-4 text-3xl font-bold text-indigo-400">Quantum Number Quest</h1>
          <p className="mt-2 text-gray-300">Initialize your quantum state to begin the experiment!</p>
        </div>

        <div className="bg-indigo-900 border-l-4 border-blue-500 text-blue-200 p-4 rounded-md" role="alert">
          <p className="font-bold">Welcome, Quantum Explorer!</p>
          <p>Prepare to embark on a journey through the quantum realm of number guessing. Register now to collapse your first wave function!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
              First Designation
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first designation"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="pl-10 bg-gray-700 text-white border-gray-600"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
              Last Designation
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last designation"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="pl-10 bg-gray-700 text-white border-gray-600"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="quantumID" className="block text-sm font-medium text-gray-300">
              Quantum ID
            </label>
            <div className="relative">
              <Cpu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
              <Input
                id="quantumID"
                type="text"
                placeholder="Enter your 10-digit Quantum ID"
                value={quantumID}
                onChange={handleQuantumIDChange}
                className={`pl-10 bg-gray-700 text-white ${isQuantumIDValid ? 'border-green-500' : 'border-gray-600'}`}
                required
                aria-required="true"
                aria-invalid={!isQuantumIDValid}
                aria-describedby="quantumIDError"
              />
            </div>
            {quantumID && !isQuantumIDValid && (
              <p id="quantumIDError" className="text-sm text-red-400">Please enter a valid 10-digit Quantum ID for multiversal identification.</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Initializing...' : 'Initialize Quantum State'}
          </Button>
        </form>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-indigo-400">{dialogContent.title}</DialogTitle>
              <DialogDescription className="text-gray-300">{dialogContent.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsDialogOpen(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white">Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}