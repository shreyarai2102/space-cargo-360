"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Plus,
  Package,
  Clock,
  FileText,
  Users,
  ChevronRight,
  Filter,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  AlertTriangle,
  Shield,
  LogOut,
  Layers3Icon as Layers3D,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function SpaceCargoDashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState(3)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Check if user is logged in
    const userStatus = localStorage.getItem("spaceCargoLoggedIn")
    if (userStatus !== "true") {
      router.push("/login")
    } else {
      setLoggedIn(true)
    }
  }, [router])

  const recentItems = [
    { id: 1, name: "Water Containers", status: "critical", lastUpdated: "2025-03-28", quantity: 5 },
    { id: 2, name: "Spectrometer", status: "normal", lastUpdated: "2025-03-27", quantity: 1 },
    { id: 3, name: "Emergency Medical Kit", status: "warning", lastUpdated: "2025-03-26", quantity: 2 },
    { id: 4, name: "Space Parts Kit", status: "normal", lastUpdated: "2025-03-25", quantity: 8 },
  ]

  const filteredItems = recentItems.filter((item) => {
    // Filter by search query
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by status
    const matchesStatus = statusFilter === "all" || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleLogout = () => {
    localStorage.removeItem("spaceCargoLoggedIn")
    localStorage.removeItem("spaceCargoUser")
    router.push("/login")
  }

  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode)
    if (!emergencyMode) {
      setNotifications(notifications + 1)
    }
  }

  if (!loggedIn) {
    return null // Will redirect to login via useEffect
  }

  return (
    <div className={`min-h-screen bg-[#050c1f] text-white font-sans ${emergencyMode ? "emergency-mode" : ""}`}>
      {/* Emergency Mode Overlay */}
      {emergencyMode && (
        <div className="fixed inset-0 bg-red-900/20 pointer-events-none z-10">
          <div className="absolute top-0 left-0 right-0 border-b-2 border-red-500 bg-red-900/50 p-2 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2 animate-pulse" />
            <span className="font-bold text-red-200">EMERGENCY MODE ACTIVE</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`border-b ${emergencyMode ? "border-red-900/50" : "border-blue-900/30"} bg-[#050c1f]/80 backdrop-blur-sm sticky top-0 z-20`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="#" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SPACE
              </span>
              <span className="text-xl font-bold text-white">CARGO</span>
              <span className="text-xl font-bold text-purple-500">360</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-white/90 hover:text-white transition-colors">
                HOME
              </Link>
              <Link href="#" className="text-white font-medium border-b-2 border-purple-500 pb-1">
                CARGO
              </Link>
              <Link href="/ar-view" className="text-white/90 hover:text-white transition-colors flex items-center">
                <Layers3D className="h-4 w-4 mr-1" /> AR VIEW
              </Link>
              <Link href="/crew-access" className="text-white/90 hover:text-white transition-colors flex items-center">
                <Users className="h-4 w-4 mr-1" /> CREW
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 mr-2">
              <Label htmlFor="emergency-mode" className={`text-xs ${emergencyMode ? "text-red-400" : "text-white/70"}`}>
                EMERGENCY
              </Label>
              <Switch
                id="emergency-mode"
                checked={emergencyMode}
                onCheckedChange={toggleEmergencyMode}
                className={emergencyMode ? "data-[state=checked]:bg-red-500" : ""}
              />
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifications(0)}>
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You have {notifications} notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-blue-500/50 hover:bg-blue-900/20">
                  {localStorage.getItem("spaceCargoUser") || "USER"} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <Shield className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Space background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050c1f]/50 to-[#050c1f]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-1">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              SPACE CARGO 360: SMART INVENTORY MANAGEMENT OPERATIONS
            </h1>
            <p className="text-blue-100/80 text-lg mb-8">OPTIMIZE, TRACK, RETRIEVE, AND MANAGE RESOURCES IN SPACE</p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className="border-blue-500/50 hover:bg-blue-900/20 transition-all duration-300 group"
              >
                VIEW CARGO
                <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                onClick={() => router.push("/add-cargo")}
              >
                <Plus className="mr-2 h-4 w-4" /> ADD CARGO
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Alert */}
      {emergencyMode && (
        <div className="container mx-auto px-4 relative z-10 -mt-8 mb-8">
          <Alert variant="destructive" className="bg-red-900/40 border-red-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Emergency Resources Protocol Activated</AlertTitle>
            <AlertDescription>
              Critical resource allocation mode is now active. All non-essential requests are temporarily suspended.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Dashboard Content */}
      <section className={`container mx-auto px-4 pb-16 ${emergencyMode ? "" : "-mt-8"} relative z-10`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Items Card */}
          <Card
            className={`${emergencyMode ? "bg-red-950/40 border-red-900/50" : "bg-blue-950/40 border-blue-900/50"} backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-300 text-sm mb-1 flex items-center">
                    <Package className="h-4 w-4 mr-2" /> Total Items
                  </p>
                  <h3 className="text-3xl font-bold">248</h3>
                  <p className="text-xs text-blue-300/70 mt-1">Across all categories</p>
                </div>
                <Button variant="ghost" size="icon" className="text-blue-300 hover:text-white hover:bg-blue-900/30">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Storage Usage Card */}
          <Card
            className={`${emergencyMode ? "bg-red-950/40 border-red-900/50" : "bg-blue-950/40 border-blue-900/50"} backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <p className="text-yellow-300 text-sm mb-1 flex items-center">
                    <FileText className="h-4 w-4 mr-2" /> Storage Usage
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold">78%</h3>
                    <p className="text-xs text-yellow-300/70">of Total Capacity</p>
                  </div>
                  <Progress
                    value={78}
                    className="h-2 mt-3 bg-blue-900/50"
                    indicatorClassName={
                      emergencyMode
                        ? "bg-gradient-to-r from-red-400 to-red-600"
                        : "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Resupply Card */}
          <Card
            className={`${emergencyMode ? "bg-red-950/40 border-red-900/50" : "bg-blue-950/40 border-blue-900/50"} backdrop-blur-sm hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-300 text-sm mb-1 flex items-center">
                    <Clock className="h-4 w-4 mr-2" /> Next Resupply
                  </p>
                  <h3 className="text-3xl font-bold">13 Days</h3>
                  <p className="text-xs text-green-300/70 mt-1">Until arrival</p>
                </div>
                <Button variant="ghost" size="icon" className="text-green-300 hover:text-white hover:bg-blue-900/30">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card
            className={`${emergencyMode ? "bg-red-950/40 border-red-900/50" : "bg-blue-950/40 border-blue-900/50"} backdrop-blur-sm col-span-1 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300`}
          >
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className={`h-auto py-4 px-3 ${emergencyMode ? "border-red-800/50 bg-red-900/20 hover:bg-red-900/40" : "border-blue-800/50 bg-blue-900/20 hover:bg-blue-900/40"} flex flex-col items-center justify-center gap-2 transition-all duration-300`}
                  onClick={() => router.push("/add-cargo")}
                >
                  <div className="bg-blue-500/20 p-2 rounded-md">
                    <Plus className="h-5 w-5 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">Add New Item</span>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto py-4 px-3 ${emergencyMode ? "border-red-800/50 bg-red-900/20 hover:bg-red-900/40" : "border-blue-800/50 bg-blue-900/20 hover:bg-blue-900/40"} flex flex-col items-center justify-center gap-2 transition-all duration-300`}
                >
                  <div className="bg-green-500/20 p-2 rounded-md">
                    <Search className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-sm font-medium">Find Item</span>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto py-4 px-3 ${emergencyMode ? "border-red-800/50 bg-red-900/20 hover:bg-red-900/40" : "border-blue-800/50 bg-blue-900/20 hover:bg-blue-900/40"} flex flex-col items-center justify-center gap-2 transition-all duration-300`}
                >
                  <div className="bg-purple-500/20 p-2 rounded-md">
                    <FileText className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-sm font-medium">My Requests</span>
                  <span className="text-xs text-blue-300/70">Awaiting 3 Signoffs</span>
                </Button>
                <Button
                  variant="outline"
                  className={`h-auto py-4 px-3 ${emergencyMode ? "border-red-800/50 bg-red-900/20 hover:bg-red-900/40" : "border-blue-800/50 bg-blue-900/20 hover:bg-blue-900/40"} flex flex-col items-center justify-center gap-2 transition-all duration-300`}
                  onClick={() => router.push("/crew-access")}
                >
                  <div className="bg-red-500/20 p-2 rounded-md">
                    <Users className="h-5 w-5 text-red-400" />
                  </div>
                  <span className="text-sm font-medium">Crew Access</span>
                  <span className="text-xs text-blue-300/70">Manage Permissions</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card
            className={`${emergencyMode ? "bg-red-950/40 border-red-900/50" : "bg-blue-950/40 border-blue-900/50"} backdrop-blur-sm col-span-1 lg:col-span-2 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search items..."
                  className={`h-8 w-[180px] ${emergencyMode ? "bg-red-900/20 border-red-800/50" : "bg-blue-900/20 border-blue-800/50"} text-sm`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Items</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("critical")}>Critical Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("warning")}>Warning Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("normal")}>Normal Status</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className={`divide-y ${emergencyMode ? "divide-red-900/30" : "divide-blue-900/30"}`}>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 ${emergencyMode ? "hover:bg-red-900/20" : "hover:bg-blue-900/20"} transition-colors flex items-center justify-between group cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            item.status === "critical"
                              ? "destructive"
                              : item.status === "warning"
                                ? "warning"
                                : "success"
                          }
                          className="h-2 w-2 rounded-full p-0"
                        />
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-xs text-blue-300/70">Last updated: {item.lastUpdated}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={`${emergencyMode ? "bg-red-900/30 hover:bg-red-900/50" : "bg-blue-900/30 hover:bg-blue-900/50"}`}
                        >
                          Qty: {item.quantity}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-blue-300/70">No items match your search criteria</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

