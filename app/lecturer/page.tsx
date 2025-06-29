"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Users, BarChart3, LogOut, CheckCircle, Clock, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import AttendanceSystem from "@/components/attendance-system"
import CourseLibrary from "@/components/course-library"

export default function LecturerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [classStats, setClassStats] = useState({
    totalStudents: 120,
    presentToday: 95,
    averageAttendance: 87,
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "lecturer") {
        // Redirect non-lecturers
        alert("Access denied. This page is for lecturers only.")
        router.push("/")
        return
      }
      setUser(parsedUser)
    } else {
      // No user data found, redirect to login
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const exportAttendance = (period: string) => {
    // In a real app, this would generate a CSV or Excel file
    alert(`Exporting attendance data for ${period}...`)

    // Simulate export process
    setTimeout(() => {
      alert(`Attendance data for ${period} exported successfully!`)
    }, 1500)
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lecturer Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, Dr. {user.name}</p>
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
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.totalStudents}</div>
              <p className="text-xs text-gray-600">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{classStats.presentToday}</div>
              <p className="text-xs text-gray-600">
                {Math.round((classStats.presentToday / classStats.totalStudents) * 100)}% attendance rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{classStats.averageAttendance}%</div>
              <p className="text-xs text-gray-600">This semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Classes */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>Your scheduled classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Computer Science 301</h3>
                  <p className="text-sm text-gray-600">Data Structures & Algorithms</p>
                  <p className="text-sm text-gray-500">9:00 AM - 11:00 AM • Room 204</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">45/50 Present</Badge>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Computer Science 401</h3>
                  <p className="text-sm text-gray-600">Software Engineering</p>
                  <p className="text-sm text-gray-500">2:00 PM - 4:00 PM • Room 301</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Upcoming</Badge>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 mb-4">
          <Button variant="outline" onClick={() => exportAttendance("Today")}>
            <Calendar className="h-4 w-4 mr-2" />
            Export Today
          </Button>
          <Button variant="outline" onClick={() => exportAttendance("This Week")}>
            <Calendar className="h-4 w-4 mr-2" />
            Export This Week
          </Button>
          <Button variant="outline" onClick={() => exportAttendance("This Month")}>
            <Calendar className="h-4 w-4 mr-2" />
            Export This Month
          </Button>
        </div>

        {/* Main Features */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Real-time Attendance</TabsTrigger>
            <TabsTrigger value="materials">Course Materials</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <AttendanceSystem userRole="lecturer" />
          </TabsContent>

          <TabsContent value="materials">
            <CourseLibrary userRole="lecturer" />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
                <CardDescription>Detailed attendance statistics and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Weekly Attendance Trend</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Chart visualization would go here</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Top Performing Classes</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <span>CS 301 - Data Structures</span>
                          <Badge className="bg-green-100 text-green-800">95%</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span>CS 401 - Software Engineering</span>
                          <Badge className="bg-blue-100 text-blue-800">92%</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Students Needing Attention</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <span>John Smith (ACU/2023/045)</span>
                          <Badge variant="destructive">65%</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span>Jane Doe (ACU/2023/078)</span>
                          <Badge className="bg-yellow-100 text-yellow-800">72%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
