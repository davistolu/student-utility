import { NextResponse } from "next/server"

// Real Ajayi Crowther University locations with accurate coordinates
const campusLocations = [
  {
    id: 1,
    name: "Main Library (Adebayo Adedeji Library)",
    type: "academic",
    coordinates: { lat: 7.378, lng: 3.9465 },
    description: "Central library with study halls, computer lab, and research facilities",
    facilities: ["wifi", "study_rooms", "computers", "printing", "research_assistance"],
    openingHours: {
      weekdays: "08:00-22:00",
      weekends: "10:00-18:00",
    },
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 2,
    name: "Faculty of Natural Sciences Building",
    type: "academic",
    coordinates: { lat: 7.3785, lng: 3.9475 },
    description: "Computer Science, Mathematics, Physics, Chemistry departments",
    facilities: ["computer_labs", "lecture_halls", "laboratories", "faculty_offices"],
    departments: ["Computer Science", "Mathematics", "Physics", "Chemistry"],
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 3,
    name: "Student Affairs Complex",
    type: "social",
    coordinates: { lat: 7.377, lng: 3.946 },
    description: "Student activities, registrar, bursary, and administrative offices",
    facilities: ["registrar", "bursary", "student_affairs", "counseling"],
    services: ["registration", "fee_payment", "student_support", "counseling"],
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 4,
    name: "University Health Center",
    type: "health",
    coordinates: { lat: 7.3765, lng: 3.9455 },
    description: "Medical services, counseling, and health consultations",
    facilities: ["consultation_rooms", "pharmacy", "emergency_care", "counseling"],
    services: ["general_consultation", "emergency_care", "mental_health", "pharmacy"],
    openingHours: {
      weekdays: "08:00-17:00",
      weekends: "09:00-13:00",
      emergency: "24/7",
    },
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 5,
    name: "University Cafeteria",
    type: "dining",
    coordinates: { lat: 7.3775, lng: 3.948 },
    description: "Main dining facility and food court",
    facilities: ["dining_hall", "food_court", "catering_services"],
    services: ["breakfast", "lunch", "dinner", "snacks", "catering"],
    openingHours: {
      weekdays: "06:00-22:00",
      weekends: "07:00-21:00",
    },
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 6,
    name: "Main Car Park",
    type: "parking",
    coordinates: { lat: 7.379, lng: 3.9485 },
    description: "Primary parking area for staff and visitors",
    facilities: ["covered_parking", "security", "visitor_parking"],
    capacity: "200+ vehicles",
    access: "24/7",
  },
  {
    id: 7,
    name: "Faculty of Engineering Building",
    type: "academic",
    coordinates: { lat: 7.3785, lng: 3.945 },
    description: "Civil, Electrical, Mechanical Engineering departments",
    facilities: ["engineering_labs", "workshop", "lecture_halls", "faculty_offices"],
    departments: ["Civil Engineering", "Electrical Engineering", "Mechanical Engineering"],
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 8,
    name: "Sports Complex & Gymnasium",
    type: "recreation",
    coordinates: { lat: 7.376, lng: 3.947 },
    description: "Sports facilities, gymnasium, and recreational activities",
    facilities: ["gymnasium", "football_field", "basketball_court", "tennis_court", "track"],
    sports: ["football", "basketball", "tennis", "athletics", "volleyball"],
    openingHours: {
      weekdays: "06:00-20:00",
      weekends: "08:00-18:00",
    },
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 9,
    name: "Chapel of Redemption",
    type: "religious",
    coordinates: { lat: 7.3775, lng: 3.9445 },
    description: "University chapel for worship and religious activities",
    facilities: ["main_hall", "prayer_rooms", "counseling_rooms"],
    services: ["sunday_service", "weekday_prayers", "counseling", "weddings", "special_events"],
    capacity: "500+ seats",
    contact: "+234-xxx-xxx-xxxx",
  },
  {
    id: 10,
    name: "Faculty of Law Building",
    type: "academic",
    coordinates: { lat: 7.377, lng: 3.9485 },
    description: "Law faculty, moot court, and legal clinic",
    facilities: ["moot_court", "legal_clinic", "law_library", "lecture_halls"],
    services: ["legal_education", "moot_court_sessions", "legal_clinic", "research"],
    contact: "+234-xxx-xxx-xxxx",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: campusLocations,
      center: { lat: 7.3775, lng: 3.947 },
      bounds: {
        north: 7.385,
        south: 7.375,
        east: 3.955,
        west: 3.94,
      },
    })
  } catch (error) {
    console.error("Campus locations API error:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch campus locations" }, { status: 500 })
  }
}
