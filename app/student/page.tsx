"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  MapPin,
  MessageSquare,
  BookOpen,
  Fingerprint,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import AttendanceSystem from "@/components/attendance-system"
import CampusMap from "@/components/campus-map"
import HealthcareChat from "@/components/healthcare-chat"
import CourseLibrary from "@/components/course-library"

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    percentage: 0,
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          router.push("/")
          return
        }

        const parsedUser = JSON.parse(userData)

        if (parsedUser.role !== "student") {
          setError("Access denied. This page is for students only.")
          setTimeout(() => router.push("/"), 2000)
          return
        }

        // Verify token with server
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          await loadAttendanceStats(data.user._id, token)
        } else {
          // Token invalid, redirect to login
          localStorage.removeItem("auth-token")
          localStorage.removeItem("user")
          router.push("/")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setError("Failed to verify authentication")
        setTimeout(() => router.push("/"), 2000)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadAttendanceStats = async (userId: string, token: string) => {
    try {
      const response = await fetch(`/api/attendance?studentId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const records = data.data || []

        const present = records.filter((r: any) => r.status === "present").length
        const total = records.length
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0

        setAttendanceStats({
          present,
          absent: total - present,
          percentage,
        })
      }
    } catch (error) {
      console.error("Failed to load attendance stats:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }

    // Clear local storage
    localStorage.removeItem("user")
    localStorage.removeItem("auth-token")

    // Redirect to login page
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Name</p>
                <p className="text-lg">{user.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              {user.matricNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Matric Number</p>
                  <p className="text-lg">{user.matricNumber}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">Department</p>
                <p className="text-lg">{user.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{attendanceStats.percentage}%</div>
              <p className="text-xs text-gray-600">
                {attendanceStats.present} present, {attendanceStats.absent} absent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-600">2 completed, 2 upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Status</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-gray-600">Last checkup: 2 weeks ago</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Features */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="attendance" className="flex items-center space-x-2">
              <Fingerprint className="h-4 w-4" />
              <span>Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Campus Map</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Healthcare</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Library</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceSystem userRole="student" userId={user._id} />
          </TabsContent>

          <TabsContent value="map">
            <CampusMap />
          </TabsContent>

          <TabsContent value="health">
            <HealthcareChat userRole="student" userId={user._id} />
          </TabsContent>

          <TabsContent value="library">
            <CourseLibrary userRole="student" userId={user._id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
