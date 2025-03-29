"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Info, Layers3Icon as Layers3D, Minus, Plus, RotateCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export default function ARViewPage() {
  const router = useRouter()
  const canvasRef = useRef(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)

  const mockItems = [
    { id: 1, name: "Water Containers", location: "Storage Bay A", quantity: 5, status: "normal" },
    { id: 2, name: "Spectrometer", location: "Lab Module", quantity: 1, status: "normal" },
    { id: 3, name: "Emergency Medical Kit", location: "Crew Quarters", quantity: 2, status: "warning" },
    { id: 4, name: "Space Parts Kit", location: "Maintenance Bay", quantity: 8, status: "normal" },
  ]

  useEffect(() => {
    // Check if user is logged in
    const userStatus = localStorage.getItem("spaceCargoLoggedIn")
    if (userStatus !== "true") {
      router.push("/login")
    } else {
      setLoggedIn(true)

      // Simulate loading the AR environment
      const timer = setTimeout(() => {
        setLoading(false)
        initCanvas()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [router])

  const initCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw mock AR environment
    drawAREnvironment(ctx, canvas.width, canvas.height)
  }

  const drawAREnvironment = (ctx, width, height) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw space station layout
    ctx.strokeStyle = "#2563eb"
    ctx.lineWidth = 2

    // Draw grid
    ctx.beginPath()
    for (let x = 0; x < width; x += 50) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }
    for (let y = 0; y < height; y += 50) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }
    ctx.strokeStyle = "rgba(59, 130, 246, 0.2)"
    ctx.stroke()

    // Draw space station modules
    const scale = zoom / 100
    const centerX = width / 2
    const centerY = height / 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.scale(scale, scale)
    ctx.rotate((rotation * Math.PI) / 180)

    // Main module
    ctx.beginPath()
    ctx.rect(-100, -40, 200, 80)
    ctx.fillStyle = "rgba(30, 58, 138, 0.5)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.stroke()

    // Storage Bay A
    ctx.beginPath()
    ctx.rect(-180, -40, 80, 80)
    ctx.fillStyle = "rgba(37, 99, 235, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.stroke()

    // Lab Module
    ctx.beginPath()
    ctx.rect(100, -40, 80, 80)
    ctx.fillStyle = "rgba(37, 99, 235, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.stroke()

    // Crew Quarters
    ctx.beginPath()
    ctx.rect(-40, 40, 80, 60)
    ctx.fillStyle = "rgba(37, 99, 235, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.stroke()

    // Maintenance Bay
    ctx.beginPath()
    ctx.rect(-40, -100, 80, 60)
    ctx.fillStyle = "rgba(37, 99, 235, 0.3)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.stroke()

    // Draw cargo locations
    mockItems.forEach((item) => {
      let x = 0,
        y = 0

      switch (item.location) {
        case "Storage Bay A":
          x = -140
          y = 0
          break
        case "Lab Module":
          x = 140
          y = 0
          break
        case "Crew Quarters":
          x = 0
          y = 70
          break
        case "Maintenance Bay":
          x = 0
          y = -70
          break
        default:
          x = 0
          y = 0
      }

      // Draw cargo indicator
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fillStyle = item.status === "warning" ? "#f59e0b" : "#10b981"
      ctx.fill()

      // Draw label
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(item.name, x, y + 25)

      // Highlight selected item
      if (selectedItem && selectedItem.id === item.id) {
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    ctx.restore()

    // Draw compass
    ctx.beginPath()
    ctx.arc(width - 40, 40, 20, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(30, 58, 138, 0.7)"
    ctx.fill()
    ctx.strokeStyle = "#3b82f6"
    ctx.stroke()

    // Draw compass needle
    ctx.save()
    ctx.translate(width - 40, 40)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.beginPath()
    ctx.moveTo(0, -15)
    ctx.lineTo(5, 0)
    ctx.lineTo(-5, 0)
    ctx.closePath()
    ctx.fillStyle = "#f43f5e"
    ctx.fill()
    ctx.restore()
  }

  const handleZoomChange = (value) => {
    setZoom(value[0])
    initCanvas()
  }

  const handleRotationChange = (value) => {
    setRotation(value)
    initCanvas()
  }

  const selectItem = (item) => {
    setSelectedItem(item)
    initCanvas()
  }

  if (!loggedIn) {
    return null // Will redirect to login via useEffect
  }

  return (
    <div className="min-h-screen bg-[#050c1f] text-white font-sans flex flex-col">
      <header className="border-b border-blue-900/30 bg-[#050c1f]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" className="mr-4 p-2" onClick={() => router.push("/")}>
              <ArrowLeft className="h-5 w-5 mr-2" /> Back
            </Button>
            <div className="flex items-center">
              <Layers3D className="h-5 w-5 text-purple-500 mr-2" />
              <h1 className="text-xl font-bold">AR Cargo View</h1>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Info className="h-4 w-4 mr-2" /> Help
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-80 p-4">
                <p className="mb-2 font-medium">AR View Controls:</p>
                <ul className="text-sm space-y-1">
                  <li>• Use the zoom slider to zoom in and out</li>
                  <li>• Rotate the view with the rotation controls</li>
                  <li>• Click on cargo indicators to see details</li>
                  <li>• Use the item list to locate specific cargo</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-950/50">
              <div className="text-center">
                <RotateCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-blue-300">Initializing AR Environment...</p>
              </div>
            </div>
          ) : (
            <canvas ref={canvasRef} className="w-full h-full" />
          )}

          {/* AR Controls */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
            <Card className="bg-blue-950/70 border-blue-900/50 backdrop-blur-sm p-2 w-48">
              <CardContent className="p-2 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Zoom</span>
                    <span className="text-xs text-blue-300">{zoom}%</span>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleZoomChange([Math.max(50, zoom - 10)])}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Slider
                      min={50}
                      max={200}
                      step={10}
                      value={[zoom]}
                      onValueChange={handleZoomChange}
                      className="flex-1 mx-2"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleZoomChange([Math.min(200, zoom + 10)])}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Rotation</span>
                    <span className="text-xs text-blue-300">{rotation}°</span>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-blue-900/30 h-8 w-8"
                      onClick={() => handleRotationChange((rotation - 45) % 360)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedItem && (
              <Card className="bg-blue-950/70 border-blue-900/50 backdrop-blur-sm p-2 w-64">
                <CardContent className="p-2">
                  <h3 className="font-medium text-sm mb-1">{selectedItem.name}</h3>
                  <div className="grid grid-cols-2 gap-1 text-xs text-blue-300">
                    <div>Location:</div>
                    <div className="text-white">{selectedItem.location}</div>
                    <div>Quantity:</div>
                    <div className="text-white">{selectedItem.quantity} units</div>
                    <div>Status:</div>
                    <div>
                      <Badge
                        variant={selectedItem.status === "warning" ? "warning" : "success"}
                        className="text-[10px] px-1"
                      >
                        {selectedItem.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="w-72 border-l border-blue-900/30 bg-blue-950/20 overflow-y-auto">
          <div className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-blue-400" />
              <input
                type="text"
                placeholder="Search cargo items..."
                className="w-full bg-blue-900/20 border border-blue-800/50 rounded-md py-2 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-sm font-medium mb-2 text-blue-200">Available Cargo</h2>
            <div className="space-y-2">
              {mockItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${selectedItem?.id === item.id ? "bg-blue-900/50" : "hover:bg-blue-900/30"}`}
                  onClick={() => selectItem(item)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <Badge variant={item.status === "warning" ? "warning" : "success"} className="text-[10px]">
                      {item.status === "warning" ? "WARN" : "OK"}
                    </Badge>
                  </div>
                  <div className="flex text-xs text-blue-300 mt-1">
                    <div className="mr-4">
                      <span className="text-blue-400">QTY:</span> {item.quantity}
                    </div>
                    <div>
                      <Eye className="inline h-3 w-3 mr-1" />
                      <span className="hover:underline">Locate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

