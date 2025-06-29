"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Navigation,
  Search,
  Building,
  Car,
  Coffee,
  BookOpen,
  Users,
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react"

// Real Ajayi Crowther University coordinates and locations
const ACU_CENTER = { lat: 7.3775, lng: 3.947 }

const campusLocations = [
  {
    id: 1,
    name: "Main Library (Adebayo Adedeji Library)",
    type: "academic",
    icon: BookOpen,
    coordinates: { lat: 7.378, lng: 3.9465 },
    description: "Central library with study halls, computer lab, and research facilities",
    placeId: "ChIJX8K5K5KLOBAR1234567890", // Placeholder - would be real Google Place ID
  },
  {
    id: 2,
    name: "Faculty of Natural Sciences Building",
    type: "academic",
    icon: Building,
    coordinates: { lat: 7.3785, lng: 3.9475 },
    description: "Computer Science, Mathematics, Physics, Chemistry departments",
    placeId: "ChIJX8K5K5KLOBAR1234567891",
  },
  {
    id: 3,
    name: "Student Affairs Complex",
    type: "social",
    icon: Users,
    coordinates: { lat: 7.377, lng: 3.946 },
    description: "Student activities, registrar, bursary, and administrative offices",
    placeId: "ChIJX8K5K5KLOBAR1234567892",
  },
  {
    id: 4,
    name: "University Health Center",
    type: "health",
    icon: Heart,
    coordinates: { lat: 7.3765, lng: 3.9455 },
    description: "Medical services, counseling, and health consultations",
    placeId: "ChIJX8K5K5KLOBAR1234567893",
  },
  {
    id: 5,
    name: "University Cafeteria",
    type: "dining",
    icon: Coffee,
    coordinates: { lat: 7.3775, lng: 3.948 },
    description: "Main dining facility and food court",
    placeId: "ChIJX8K5K5KLOBAR1234567894",
  },
  {
    id: 6,
    name: "Main Car Park",
    type: "parking",
    icon: Car,
    coordinates: { lat: 7.379, lng: 3.9485 },
    description: "Primary parking area for staff and visitors",
    placeId: "ChIJX8K5K5KLOBAR1234567895",
  },
  {
    id: 7,
    name: "Faculty of Engineering Building",
    type: "academic",
    icon: Building,
    coordinates: { lat: 7.3785, lng: 3.945 },
    description: "Civil, Electrical, Mechanical Engineering departments",
    placeId: "ChIJX8K5K5KLOBAR1234567896",
  },
  {
    id: 8,
    name: "Sports Complex & Gymnasium",
    type: "recreation",
    icon: Users,
    coordinates: { lat: 7.376, lng: 3.947 },
    description: "Sports facilities, gymnasium, and recreational activities",
    placeId: "ChIJX8K5K5KLOBAR1234567897",
  },
  {
    id: 9,
    name: "Chapel of Redemption",
    type: "religious",
    icon: Building,
    coordinates: { lat: 7.3775, lng: 3.9445 },
    description: "University chapel for worship and religious activities",
    placeId: "ChIJX8K5K5KLOBAR1234567898",
  },
  {
    id: 10,
    name: "Faculty of Law Building",
    type: "academic",
    icon: Building,
    coordinates: { lat: 7.377, lng: 3.9485 },
    description: "Law faculty, moot court, and legal clinic",
    placeId: "ChIJX8K5K5KLOBAR1234567899",
  },
  {
    id: 11,
    name: "Vice-Chancellor's Office",
    type: "administrative",
    icon: Building,
    coordinates: { lat: 7.378, lng: 3.944 },
    description: "Administrative headquarters and executive offices",
    placeId: "ChIJX8K5K5KLOBAR1234567900",
  },
  {
    id: 12,
    name: "Student Hostels (Male)",
    type: "accommodation",
    icon: Building,
    coordinates: { lat: 7.3795, lng: 3.946 },
    description: "Male student residential accommodation",
    placeId: "ChIJX8K5K5KLOBAR1234567901",
  },
  {
    id: 13,
    name: "Student Hostels (Female)",
    type: "accommodation",
    icon: Building,
    coordinates: { lat: 7.3755, lng: 3.9485 },
    description: "Female student residential accommodation",
    placeId: "ChIJX8K5K5KLOBAR1234567902",
  },
  {
    id: 14,
    name: "University Gate (Main Entrance)",
    type: "entrance",
    icon: MapPin,
    coordinates: { lat: 7.38, lng: 3.947 },
    description: "Main university entrance and security checkpoint",
    placeId: "ChIJX8K5K5KLOBAR1234567903",
  },
]

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function CampusMap() {
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLocation, setCurrentLocation] = useState<any>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [route, setRoute] = useState<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [distance, setDistance] = useState("")

  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const directionsServiceRef = useRef<any>(null)
  const directionsRendererRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const currentLocationMarkerRef = useRef<any>(null)

  const filteredLocations = campusLocations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    loadGoogleMaps()
  }, [])

  const loadGoogleMaps = () => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap()
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=initMap`
    script.async = true
    script.defer = true

    // Set up callback
    window.initMap = initializeMap

    // Handle script load errors
    script.onerror = () => {
      setError("Failed to load Google Maps. Please check your API key and internet connection.")
    }

    document.head.appendChild(script)
  }

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return

    try {
      // Initialize map centered on ACU
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center: ACU_CENTER,
        zoom: 17,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi.school",
            elementType: "labels",
            stylers: [{ visibility: "on" }],
          },
        ],
      })

      // Initialize directions service and renderer
      directionsServiceRef.current = new window.google.maps.DirectionsService()
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
          strokeColor: "#4285F4",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      })
      directionsRendererRef.current.setMap(googleMapRef.current)

      // Add location markers
      addLocationMarkers()

      // Try to get user's current location
      getCurrentLocation()

      setMapLoaded(true)
    } catch (error) {
      console.error("Error initializing map:", error)
      setError("Failed to initialize map. Please refresh the page.")
    }
  }

  const addLocationMarkers = () => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    campusLocations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: location.coordinates,
        map: googleMapRef.current,
        title: location.name,
        icon: {
          url: getMarkerIcon(location.type),
          scaledSize: new window.google.maps.Size(32, 32),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(16, 32),
        },
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${location.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${location.description}</p>
            <button 
              onclick="window.selectLocationFromMap(${location.id})" 
              style="background: #4285F4; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer;"
            >
              Get Directions
            </button>
          </div>
        `,
      })

      marker.addListener("click", () => {
        infoWindow.open(googleMapRef.current, marker)
        setSelectedLocation(location)
      })

      markersRef.current.push(marker)
    })

    // Make selectLocationFromMap globally available
    window.selectLocationFromMap = (locationId: number) => {
      const location = campusLocations.find((l) => l.id === locationId)
      if (location) {
        startNavigation(location)
      }
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          // Check if user is within university bounds (approximate)
          const universityBounds = new window.google.maps.LatLngBounds(
            new window.google.maps.LatLng(7.375, 3.94), // SW corner
            new window.google.maps.LatLng(7.385, 3.955), // NE corner
          )

          if (universityBounds.contains(new window.google.maps.LatLng(userLocation.lat, userLocation.lng))) {
            setCurrentLocation(userLocation)
            addCurrentLocationMarker(userLocation)
          } else {
            // User is outside university, use default center
            setCurrentLocation(ACU_CENTER)
            addCurrentLocationMarker(ACU_CENTER)
          }
        },
        (error) => {
          console.warn("Geolocation error:", error)
          // Fallback to university center
          setCurrentLocation(ACU_CENTER)
          addCurrentLocationMarker(ACU_CENTER)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      )
    } else {
      setCurrentLocation(ACU_CENTER)
      addCurrentLocationMarker(ACU_CENTER)
    }
  }

  const addCurrentLocationMarker = (location: any) => {
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null)
    }

    currentLocationMarkerRef.current = new window.google.maps.Marker({
      position: location,
      map: googleMapRef.current,
      title: "Your Location",
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: new window.google.maps.Point(12, 12),
      },
      zIndex: 1000,
    })
  }

  const getMarkerIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      academic: "🏫",
      social: "👥",
      health: "🏥",
      dining: "🍽️",
      parking: "🅿️",
      recreation: "🏃",
      religious: "⛪",
      administrative: "🏢",
      accommodation: "🏠",
      entrance: "🚪",
    }

    const emoji = iconMap[type] || "📍"

    return (
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="white" stroke="#333" strokeWidth="2"/>
        <text x="16" y="20" textAnchor="middle" fontSize="14">${emoji}</text>
      </svg>
    `)
    )
  }

  const startNavigation = async (destination: any) => {
    if (!currentLocation || !directionsServiceRef.current) {
      setError("Unable to get your current location for navigation")
      return
    }

    setIsNavigating(true)
    setError("")

    try {
      const request = {
        origin: currentLocation,
        destination: destination.coordinates,
        travelMode: window.google.maps.TravelMode.WALKING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      }

      directionsServiceRef.current.route(request, (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRendererRef.current.setDirections(result)

          const route = result.routes[0]
          const leg = route.legs[0]

          setDistance(leg.distance.text)
          setEstimatedTime(leg.duration.text)
          setRoute({
            from: currentLocation,
            to: destination.coordinates,
            destination: destination.name,
            distance: leg.distance.text,
            duration: leg.duration.text,
            steps: leg.steps,
          })

          setSelectedLocation(destination)

          // Fit map to show entire route
          const bounds = new window.google.maps.LatLngBounds()
          bounds.extend(currentLocation)
          bounds.extend(destination.coordinates)
          googleMapRef.current.fitBounds(bounds)
        } else {
          console.error("Directions request failed:", status)
          setError("Unable to calculate route. Please try again.")
        }
        setIsNavigating(false)
      })
    } catch (error) {
      console.error("Navigation error:", error)
      setError("Navigation failed. Please try again.")
      setIsNavigating(false)
    }
  }

  const stopNavigation = () => {
    setIsNavigating(false)
    setRoute(null)
    setDistance("")
    setEstimatedTime("")

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] })
    }

    // Reset map view to show all markers
    const bounds = new window.google.maps.LatLngBounds()
    campusLocations.forEach((location) => {
      bounds.extend(location.coordinates)
    })
    if (currentLocation) {
      bounds.extend(currentLocation)
    }
    googleMapRef.current.fitBounds(bounds)
  }

  const getLocationTypeColor = (type: string) => {
    const colorMap: { [key: string]: string } = {
      academic: "text-blue-600",
      social: "text-green-600",
      health: "text-red-600",
      dining: "text-orange-600",
      parking: "text-gray-600",
      recreation: "text-purple-600",
      religious: "text-yellow-600",
      administrative: "text-indigo-600",
      accommodation: "text-pink-600",
      entrance: "text-teal-600",
    }
    return colorMap[type] || "text-gray-600"
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-800">
          Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment
          variables.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>ACU Campus Navigation</span>
          </CardTitle>
          <CardDescription>Real-time navigation within Ajayi Crowther University campus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search for locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {isNavigating && route && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Navigating to {route.destination}</p>
                    <p className="text-sm text-gray-600">
                      {distance} • {estimatedTime} walking
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={stopNavigation}>
                  Stop Navigation
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Google Map Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Campus Map</CardTitle>
              <CardDescription>Interactive Google Maps view of ACU campus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
                <div ref={mapRef} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details and Search Results */}
        <div className="space-y-6">
          {/* Selected Location Details */}
          {selectedLocation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <selectedLocation.icon className={`h-5 w-5 ${getLocationTypeColor(selectedLocation.type)}`} />
                  <span className="text-sm">{selectedLocation.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedLocation.type}</Badge>
                  </div>
                  {route && (
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Distance:</strong> {distance}
                      </p>
                      <p>
                        <strong>Walking Time:</strong> {estimatedTime}
                      </p>
                    </div>
                  )}
                  <Button
                    onClick={() => startNavigation(selectedLocation)}
                    className="w-full"
                    disabled={isNavigating || !mapLoaded}
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Calculating Route...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Directions
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location List */}
          <Card>
            <CardHeader>
              <CardTitle>Campus Locations</CardTitle>
              <CardDescription>
                {searchQuery ? `Search results for "${searchQuery}"` : "All campus locations"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLocations.map((location) => {
                  const IconComponent = location.icon
                  return (
                    <div
                      key={location.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedLocation?.id === location.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-4 w-4 ${getLocationTypeColor(location.type)}`} />
                        <div>
                          <p className="font-medium text-sm">{location.name}</p>
                          <p className="text-xs text-gray-600 capitalize">{location.type}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          startNavigation(location)
                        }}
                        disabled={!mapLoaded}
                      >
                        <Navigation className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const library = campusLocations.find((l) => l.name.includes("Library"))
                    if (library) startNavigation(library)
                  }}
                  disabled={!mapLoaded}
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Library
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const cafeteria = campusLocations.find((l) => l.name.includes("Cafeteria"))
                    if (cafeteria) startNavigation(cafeteria)
                  }}
                  disabled={!mapLoaded}
                >
                  <Coffee className="h-3 w-3 mr-1" />
                  Cafeteria
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const health = campusLocations.find((l) => l.name.includes("Health"))
                    if (health) startNavigation(health)
                  }}
                  disabled={!mapLoaded}
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Health Center
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const parking = campusLocations.find((l) => l.name.includes("Car Park"))
                    if (parking) startNavigation(parking)
                  }}
                  disabled={!mapLoaded}
                >
                  <Car className="h-3 w-3 mr-1" />
                  Parking
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
