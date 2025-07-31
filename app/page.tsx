"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Ship,
  Anchor,
  Waves,
  Wind,
  Thermometer,
  AlertTriangle,
  Activity,
  MapPin,
  MessageCircle,
  BarChart3,
  Leaf,
  Fish,
  Navigation,
} from "lucide-react"

// Mock data generators
const generateVesselData = () => {
  const vessels = []
  const vesselTypes = ["Cargo", "Tanker", "Fishing", "Passenger", "Tug"]
  const statuses = ["Active", "Anchored", "Maintenance"]

  for (let i = 0; i < 12; i++) {
    vessels.push({
      id: `V${1000 + i}`,
      name: `Vessel ${String.fromCharCode(65 + i)}`,
      type: vesselTypes[Math.floor(Math.random() * vesselTypes.length)],
      lat: 19.076 + (Math.random() - 0.5) * 0.8,
      lng: 72.8777 + (Math.random() - 0.5) * 0.8,
      speed: Math.random() * 25 + 5,
      heading: Math.random() * 360,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdate: new Date().toLocaleTimeString(),
    })
  }
  return vessels
}

const generateEnvironmentalData = () => ({
  waterQuality: {
    ph: 7.5 + Math.random() * 1,
    dissolvedOxygen: 6 + Math.random() * 3,
    turbidity: 1 + Math.random() * 4,
    temperature: 24 + Math.random() * 6,
  },
  weather: {
    windSpeed: 5 + Math.random() * 15,
    windDirection: Math.random() * 360,
    waveHeight: 0.5 + Math.random() * 2.5,
    visibility: 5 + Math.random() * 10,
  },
  pollutionIndex: Math.floor(Math.random() * 60) + 20,
  biodiversityScore: Math.floor(Math.random() * 35) + 60,
})

const generateAlerts = () => {
  const alertTypes = ["Collision Risk", "Weather Warning", "Pollution Alert", "Restricted Area"]
  const severities = ["Low", "Medium", "High"]
  const alerts = []

  for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
    alerts.push({
      id: `A${1000 + i}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: `Alert detected in sector ${Math.floor(Math.random() * 10) + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
      vesselId: `V${1000 + Math.floor(Math.random() * 12)}`,
    })
  }
  return alerts
}

export default function NauticNetDashboard() {
  const [vessels, setVessels] = useState([])
  const [environmental, setEnvironmental] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message:
        "Hello! I'm your maritime assistant. I can help you with vessel tracking, environmental monitoring, and safety alerts. What would you like to know?",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Initialize data
  useEffect(() => {
    const loadData = () => {
      setVessels(generateVesselData())
      setEnvironmental(generateEnvironmentalData())
      setAlerts(generateAlerts())
      setLastUpdate(new Date())
    }

    loadData()
    const interval = setInterval(loadData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = { type: "user", message: chatInput }
    setChatMessages((prev) => [...prev, userMessage])

    // Simple bot responses
    const responses = {
      vessel:
        "I can see 12 vessels currently active in the monitoring area. 8 are cargo vessels, 2 are fishing boats, and 2 are passenger vessels.",
      weather:
        "Current weather conditions show moderate winds at 12 m/s with good visibility. Wave height is approximately 1.2 meters.",
      pollution: `Current pollution index is ${environmental?.pollutionIndex || 45}. This is within acceptable limits for maritime operations.`,
      alert: `There are ${alerts.length} active alerts. The most recent is a ${alerts[0]?.type || "Weather Warning"} with ${alerts[0]?.severity || "Medium"} severity.`,
      help: "I can provide information about vessel positions, environmental conditions, weather updates, pollution levels, and safety alerts. Just ask!",
    }

    let botResponse =
      "I'm here to help with maritime operations. You can ask about vessels, weather, pollution, or alerts."

    for (const [key, response] of Object.entries(responses)) {
      if (chatInput.toLowerCase().includes(key)) {
        botResponse = response
        break
      }
    }

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { type: "bot", message: botResponse }])
    }, 1000)

    setChatInput("")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Anchored":
        return "bg-yellow-500"
      case "Maintenance":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "default"
    }
  }

  if (!environmental) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Ship className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading Nautic Net...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Anchor className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nautic Net</h1>
                <p className="text-sm text-gray-500">Maritime Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="vessels" className="flex items-center space-x-2">
              <Ship className="h-4 w-4" />
              <span>Vessels</span>
            </TabsTrigger>
            <TabsTrigger value="environment" className="flex items-center space-x-2">
              <Leaf className="h-4 w-4" />
              <span>Environment</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Assistant</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Vessels</CardTitle>
                  <Ship className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vessels.filter((v) => v.status === "Active").length}</div>
                  <p className="text-xs text-muted-foreground">{vessels.length} total vessels</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {alerts.filter((a) => a.severity === "High").length} high priority
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pollution Index</CardTitle>
                  <Waves className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmental.pollutionIndex}</div>
                  <Progress value={environmental.pollutionIndex} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Temp</CardTitle>
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{environmental.waterQuality.temperature.toFixed(1)}°C</div>
                  <p className="text-xs text-muted-foreground">pH: {environmental.waterQuality.ph.toFixed(1)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Alerts */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Recent Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <span className="text-sm font-medium">{alert.type}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-400">{alert.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Live Map Placeholder */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Live Vessel Map</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-200 opacity-30">
                      <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="absolute top-12 right-8 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-8 left-12 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-16 right-16 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="absolute top-20 left-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-center z-10">
                      <Navigation className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-blue-700 font-medium">Interactive Map</p>
                      <p className="text-blue-600 text-sm">Showing {vessels.length} vessels in real-time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vessels Tab */}
          <TabsContent value="vessels" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Vessel Tracking Map</CardTitle>
                  <CardDescription>Real-time positions of all monitored vessels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0">
                      {vessels.map((vessel, index) => (
                        <div
                          key={vessel.id}
                          className="absolute w-3 h-3 rounded-full animate-pulse"
                          style={{
                            left: `${20 + (index % 4) * 20}%`,
                            top: `${20 + Math.floor(index / 4) * 25}%`,
                            backgroundColor:
                              vessel.status === "Active"
                                ? "#10b981"
                                : vessel.status === "Anchored"
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-center z-10">
                      <Ship className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <p className="text-blue-700 font-medium">Vessel Tracking</p>
                      <p className="text-blue-600 text-sm">{vessels.length} vessels monitored</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Vessels</CardTitle>
                  <CardDescription>Current vessel status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {vessels.map((vessel) => (
                    <div key={vessel.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{vessel.name}</span>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(vessel.status)}`}></div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Type: {vessel.type}</p>
                        <p>Speed: {vessel.speed.toFixed(1)} knots</p>
                        <p>Status: {vessel.status}</p>
                        <p className="text-xs text-gray-400">Updated: {vessel.lastUpdate}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Environment Tab */}
          <TabsContent value="environment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Waves className="h-5 w-5" />
                    <span>Water Quality</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>pH Level</span>
                    <span className="font-medium">{environmental.waterQuality.ph.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dissolved O₂</span>
                    <span className="font-medium">{environmental.waterQuality.dissolvedOxygen.toFixed(1)} mg/L</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Turbidity</span>
                    <span className="font-medium">{environmental.waterQuality.turbidity.toFixed(1)} NTU</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature</span>
                    <span className="font-medium">{environmental.waterQuality.temperature.toFixed(1)}°C</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wind className="h-5 w-5" />
                    <span>Weather</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Wind Speed</span>
                    <span className="font-medium">{environmental.weather.windSpeed.toFixed(1)} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind Direction</span>
                    <span className="font-medium">{environmental.weather.windDirection.toFixed(0)}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wave Height</span>
                    <span className="font-medium">{environmental.weather.waveHeight.toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Visibility</span>
                    <span className="font-medium">{environmental.weather.visibility.toFixed(1)} km</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pollution Index</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{environmental.pollutionIndex}</div>
                    <p className="text-sm text-gray-500">Current Level</p>
                  </div>
                  <Progress value={environmental.pollutionIndex} className="h-3" />
                  <p className="text-xs text-center text-gray-500">
                    {environmental.pollutionIndex < 40
                      ? "Good"
                      : environmental.pollutionIndex < 70
                        ? "Moderate"
                        : "High"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Fish className="h-5 w-5" />
                    <span>Biodiversity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{environmental.biodiversityScore}</div>
                    <p className="text-sm text-gray-500">Health Score</p>
                  </div>
                  <Progress value={environmental.biodiversityScore} className="h-3" />
                  <p className="text-xs text-center text-gray-500">Marine ecosystem health</p>
                </CardContent>
              </Card>
            </div>

            {/* ML Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>ML Predictions & Forecasts</CardTitle>
                <CardDescription>AI-powered environmental forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Pollution Forecast</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">↗ +12%</p>
                    <p className="text-sm text-blue-700">Next 24 hours</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Weather Stability</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">92%</p>
                    <p className="text-sm text-green-700">Favorable conditions</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Risk Assessment</h4>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">Low</p>
                    <p className="text-sm text-yellow-700">Current maritime risk</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Performance</CardTitle>
                  <CardDescription>Operational efficiency metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Fuel Efficiency</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Route Optimization</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={92} className="w-20" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Safety Compliance</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={98} className="w-20" />
                      <span className="text-sm font-medium">98%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Environmental Impact</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings</CardTitle>
                  <CardDescription>Monthly operational savings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Fuel Savings</h4>
                    <p className="text-2xl font-bold text-green-600 mt-2">₹2.3L</p>
                    <p className="text-sm text-green-700">23% reduction</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Time Optimization</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-2">15 hrs</p>
                    <p className="text-sm text-blue-700">Average per route</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Maintenance</h4>
                    <p className="text-2xl font-bold text-purple-600 mt-2">₹85K</p>
                    <p className="text-sm text-purple-700">Predictive savings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Automated Reports</CardTitle>
                <CardDescription>Generate comprehensive maritime reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span>Daily Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Activity className="h-6 w-6 mb-2" />
                    <span>Weekly Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Leaf className="h-6 w-6 mb-2" />
                    <span>Environmental Impact</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assistant Tab */}
          <TabsContent value="assistant" className="space-y-6">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Maritime Intelligence Assistant</span>
                </CardTitle>
                <CardDescription>
                  Ask me about vessel tracking, environmental conditions, or maritime operations
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about vessels, weather, pollution, or alerts..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button type="submit">Send</Button>
                </form>

                <div className="flex flex-wrap gap-2 mt-3">
                  {["Show vessel status", "Weather conditions", "Pollution levels", "Active alerts"].map(
                    (suggestion) => (
                      <Button key={suggestion} variant="outline" size="sm" onClick={() => setChatInput(suggestion)}>
                        {suggestion}
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
