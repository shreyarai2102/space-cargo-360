"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError("")
    setLoading(true)

    // Validate inputs
    if (!username || !password) {
      setError("Username and password are required")
      setLoading(false)
      return
    }

    // Mock authentication - in a real app this would call an API
    setTimeout(() => {
      // Mock credentials for demo
      if (username === "admin" && password === "spacecargo123") {
        // Store login state in localStorage
        localStorage.setItem("spaceCargoLoggedIn", "true")
        localStorage.setItem("spaceCargoUser", username)
        router.push("/")
      } else {
        setError("Invalid username or password")
        setLoading(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050c1f] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1200&width=1200"
          alt="Space background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050c1f]/50 to-[#050c1f] pointer-events-none" />
      </div>

      {/* Star particles */}
      <div className="absolute inset-0 z-1 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-md mx-4 bg-blue-950/50 border-blue-900/50 backdrop-blur-sm z-10">
        <CardHeader className="space-y-1 items-center text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              SPACE
            </span>
            <span className="text-2xl font-bold text-white">CARGO</span>
            <span className="text-2xl font-bold text-purple-500">360</span>
          </div>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-blue-300/80">
            Enter your credentials to access the cargo system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/40 border border-red-800 rounded-md text-red-200 text-sm mb-4">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="Enter your username"
                className="bg-blue-900/20 border-blue-800/70 pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/70" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="bg-blue-900/20 border-blue-800/70 pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-500/70" />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-1 top-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-blue-500/70" />
                ) : (
                  <Eye className="h-4 w-4 text-blue-500/70" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

