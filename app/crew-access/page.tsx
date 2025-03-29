"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, Search, Shield, Users, UserPlus, X, Check, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CrewAccessPage() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [openAddDialog, setOpenAddDialog] = useState(false)

  const crewMembers = [
    {
      id: 1,
      name: "Cmdr. Sarah Chen",
      role: "Commander",
      accessLevel: "Full",
      status: "active",
      lastAccess: "2025-03-28 14:32",
    },
    {
      id: 2,
      name: "Dr. Alex Martinez",
      role: "Science Officer",
      accessLevel: "Limited",
      status: "active",
      lastAccess: "2025-03-28 10:15",
    },
    {
      id: 3,
      name: "Lt. James Wilson",
      role: "Engineering",
      accessLevel: "Standard",
      status: "active",
      lastAccess: "2025-03-27 22:45",
    },
    {
      id: 4,
      name: "Maya Patel",
      role: "Medical Officer",
      accessLevel: "Medical",
      status: "inactive",
      lastAccess: "2025-03-25 09:10",
    },
    {
      id: 5,
      name: "Capt. David Rodriguez",
      role: "Security",
      accessLevel: "Security",
      status: "active",
      lastAccess: "2025-03-28 13:20",
    },
  ]

  const accessLevels = [
    { value: "Full", description: "Complete access to all cargo and systems" },
    { value: "Standard", description: "Access to standard inventory and requests" },
    { value: "Limited", description: "View-only access to cargo inventory" },
    { value: "Medical", description: "Access to medical supplies only" },
    { value: "Security", description: "Security and restricted item access" },
  ]

  const filteredCrew = crewMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    // Check if user is logged in
    const userStatus = localStorage.getItem("spaceCargoLoggedIn")
    if (userStatus !== "true") {
      router.push("/login")
    } else {
      setLoggedIn(true)
    }
  }, [router])

  if (!loggedIn) {
    return null // Will redirect to login via useEffect
  }

  return (
    <div className="min-h-screen bg-[#050c1f] text-white font-sans">
      <header className="border-b border-blue-900/30 bg-[#050c1f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-4 p-2" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5 mr-2" /> Back
            </Button>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-purple-500 mr-2" />
              <h1 className="text-xl font-bold">Crew Access Management</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Access Control Panel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
                <Input
                  placeholder="Search crew members..."
                  className="pl-9 bg-blue-900/20 border-blue-800/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-40 bg-blue-900/20 border-blue-800/50">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <UserPlus className="h-4 w-4 mr-2" /> Add Crew
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-blue-950 border-blue-900">
                    <DialogHeader>
                      <DialogTitle>Add New Crew Member</DialogTitle>
                      <DialogDescription>Add a new crew member and set their cargo access level</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input className="bg-blue-900/20 border-blue-800/50" placeholder="Enter full name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Input className="bg-blue-900/20 border-blue-800/50" placeholder="Enter crew role" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Access Level</label>
                        <Select>
                          <SelectTrigger className="bg-blue-900/20 border-blue-800/50">
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                          <SelectContent>
                            {accessLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setOpenAddDialog(false)}>
                        Add Crew Member
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-blue-900/30 hover:bg-transparent">
                  <TableHead className="text-blue-300">Crew Member</TableHead>
                  <TableHead className="text-blue-300">Role</TableHead>
                  <TableHead className="text-blue-300">Access Level</TableHead>
                  <TableHead className="text-blue-300">Status</TableHead>
                  <TableHead className="text-blue-300">Last Access</TableHead>
                  <TableHead className="text-blue-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCrew.length > 0 ? (
                  filteredCrew.map((member) => (
                    <TableRow key={member.id} className="border-blue-900/30 hover:bg-blue-900/20">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                            <AvatarFallback className="bg-blue-900 text-blue-100">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant={member.accessLevel === "Full" ? "default" : "outline"}
                                className={`cursor-help ${
                                  member.accessLevel === "Security"
                                    ? "bg-red-900/40 hover:bg-red-900/50 text-red-100"
                                    : member.accessLevel === "Full"
                                      ? "bg-purple-900/40 hover:bg-purple-900/50 text-purple-100"
                                      : "bg-blue-900/40 hover:bg-blue-900/50"
                                }`}
                              >
                                {member.accessLevel}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {accessLevels.find((l) => l.value === member.accessLevel)?.description ||
                                  "Custom access level"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`h-2 w-2 rounded-full mr-2 ${member.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                          />
                          <span className="capitalize">{member.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-blue-300">{member.lastAccess}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 hover:text-blue-300">
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-blue-300">
                      <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No crew members match your search criteria</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            Access Alerts
          </h2>
          <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="p-3 border border-yellow-800 rounded-md bg-yellow-900/20 flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-200">Multiple Failed Access Attempts</p>
                    <p className="text-sm text-yellow-200/80 mt-1">
                      3 failed access attempts for Medical Storage from unrecognized device
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View Details
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700">
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 border border-green-800 rounded-md bg-green-900/20 flex items-start">
                  <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-green-200">Access Permissions Updated</p>
                    <p className="text-sm text-green-200/80 mt-1">
                      Crew access levels were successfully updated on 2025-03-28
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">
                        View Log
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

