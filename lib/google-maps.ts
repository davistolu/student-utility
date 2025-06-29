// Google Maps utility functions and types

export interface Location {
  id: number
  name: string
  type: string
  coordinates: {
    lat: number
    lng: number
  }
  description: string
  placeId?: string
}

export interface NavigationRoute {
  from: { lat: number; lng: number }
  to: { lat: number; lng: number }
  destination: string
  distance: string
  duration: string
  steps: any[]
}

export const ACU_BOUNDS = {
  north: 7.385,
  south: 7.375,
  east: 3.955,
  west: 3.94,
}

export const ACU_CENTER = { lat: 7.3775, lng: 3.947 }

// Check if coordinates are within ACU campus bounds
export function isWithinCampus(lat: number, lng: number): boolean {
  return lat >= ACU_BOUNDS.south && lat <= ACU_BOUNDS.north && lng >= ACU_BOUNDS.west && lng <= ACU_BOUNDS.east
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

// Formate distance for display
export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)}m`
  }
  return `${distanceInKm.toFixed(1)}km`
}

// Estimated walking time (average walking speed: 5 km/h)
export function estimateWalkingTime(distanceInKm: number): string {
  const walkingSpeedKmh = 5
  const timeInHours = distanceInKm / walkingSpeedKmh
  const timeInMinutes = Math.round(timeInHours * 60)

  if (timeInMinutes < 60) {
    return `${timeInMinutes} min`
  }

  const hours = Math.floor(timeInMinutes / 60)
  const minutes = timeInMinutes % 60
  return `${hours}h ${minutes}m`
}

// Get marker icon or emoji or URL....idk for different location types
export function getMarkerIconUrl(type: string): string {
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
      <circle cx="16" cy="16" r="12" fill="white" stroke="#333" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" font-size="14">${emoji}</text>
    </svg>
  `)
  )
}

// Load Google Maps script dynamically
export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve()
      return
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve())
      existingScript.addEventListener("error", reject)
      return
    }

    // Create and load script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMap`
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = reject

    document.head.appendChild(script)
  })
}
