"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Check, Info, Package, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AddCargoPage() {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Form state
  const [cargoName, setCargoName] = useState("")
  const [category, setCategory] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [priority, setPriority] = useState("normal")
  const [description, setDescription] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [storageRequirements, setStorageRequirements] = useState("")
  const [imageUploaded, setImageUploaded] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const userStatus = localStorage.getItem("spaceCargoLoggedIn")
    if (userStatus !== "true") {
      router.push("/login")
    } else {
      setLoggedIn(true)
    }
  }, [router])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!cargoName || !category || quantity < 1) {
      alert("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Mock API call - would send data to a server in a real application
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      // Reset form after showing success message
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }, 1500)
  }

  if (!loggedIn) {
    return null // Will redirect to login via useEffect
  }

  return (
    <div className="min-h-screen bg-[#050c1f] text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-blue-400 hover:text-blue-300"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="flex items-center mb-8">
          <Package className="h-6 w-6 mr-3 text-purple-400" />
          <h1 className="text-2xl font-bold">Add New Cargo Item</h1>
        </div>

        {success ? (
          <Card className="bg-green-900/20 border-green-700 max-w-2xl mx-auto">
            <CardContent className="pt-6 flex flex-col items-center justify-center p-10 text-center">
              <div className="h-12 w-12 rounded-full bg-green-600/30 flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Cargo Added Successfully</h2>
              <p className="text-green-200/80 mb-4">Your new cargo item has been added to the inventory</p>
              <Button onClick={() => router.push("/")} className="mt-2">
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
              <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Cargo Details</CardTitle>
                  <CardDescription>Enter the basic information about the cargo item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo-name">
                      Cargo Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cargo-name"
                      placeholder="e.g. Water Containers"
                      className="bg-blue-900/20 border-blue-800/50"
                      value={cargoName}
                      onChange={(e) => setCargoName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="bg-blue-900/20 border-blue-800/50">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consumables">Consumables</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="experiments">Experiments</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="quantity">
                        Quantity <span className="text-red-500">*</span>
                      </Label>
                      <span className="text-sm text-blue-300">{quantity}</span>
                    </div>
                    <Slider
                      id="quantity"
                      min={1}
                      max={50}
                      step={1}
                      value={[quantity]}
                      onValueChange={(value) => setQuantity(value[0])}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="priority">Priority Level</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-blue-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-[200px] text-xs">
                              Critical: Essential for life support
                              <br />
                              High: Important for operations
                              <br />
                              Normal: Standard supplies
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <RadioGroup value={priority} onValueChange={setPriority} className="flex space-x-2">
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="critical" id="critical" className="text-red-500" />
                        <Label htmlFor="critical" className="text-red-300">
                          Critical
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="high" id="high" className="text-yellow-500" />
                        <Label htmlFor="high" className="text-yellow-300">
                          High
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="normal" id="normal" className="text-green-500" />
                        <Label htmlFor="normal" className="text-green-300">
                          Normal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-950/40 border-blue-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Provide more details about the cargo item</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter a description of the cargo item"
                      className="bg-blue-900/20 border-blue-800/50 min-h-[100px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiration-date">Expiration Date (if applicable)</Label>
                    <div className="relative">
                      <Input
                        id="expiration-date"
                        type="date"
                        className="bg-blue-900/20 border-blue-800/50"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                      />
                      <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-blue-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storage-requirements">Storage Requirements</Label>
                    <Select value={storageRequirements} onValueChange={setStorageRequirements}>
                      <SelectTrigger className="bg-blue-900/20 border-blue-800/50">
                        <SelectValue placeholder="Select storage requirements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="refrigerated">Refrigerated</SelectItem>
                        <SelectItem value="vacuum">Vacuum Sealed</SelectItem>
                        <SelectItem value="pressurized">Pressurized</SelectItem>
                        <SelectItem value="hazardous">Hazardous Materials</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cargo Image</Label>
                    <div
                      className={`border-2 border-dashed rounded-md p-8 text-center ${imageUploaded ? "border-green-500 bg-green-900/20" : "border-blue-800/50 bg-blue-900/20"}`}
                    >
                      {imageUploaded ? (
                        <div className="flex flex-col items-center">
                          <Check className="h-8 w-8 text-green-400 mb-2" />
                          <p className="text-green-300">Image uploaded successfully</p>
                          <Button
                            variant="link"
                            className="text-blue-400 p-0 h-auto mt-2"
                            onClick={() => setImageUploaded(false)}
                          >
                            Remove image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-8 w-8 text-blue-400 mb-2" />
                          <p className="text-blue-300 mb-2">Drag and drop an image or click to browse</p>
                          <Button variant="outline" className="mt-2" onClick={() => setImageUploaded(true)}>
                            Upload Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-end max-w-6xl">
              <Button variant="outline" className="mr-4" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                {loading ? "Processing..." : "Add to Inventory"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

