"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Users, LogOut, UserPlus, BookOpen, MessageSquare, BarChart3, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1250,
    activeStudents: 1100,
    lecturers: 45,
    healthChats: 23,
    attendanceToday: 95,
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "admin") {
        // Redirect non-admins
        alert("Access denied. This page is for administrators only.")
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

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      matricNumber: "ACU/2023/001",
      department: "Computer Science",
      email: "john.doe@acu.edu.ng",
      role: "student",
      status: "active",
    },
    {
      id: 2,
      name: "Dr. Sarah Johnson",
      department: "Computer Science",
      email: "s.johnson@acu.edu.ng",
      role: "lecturer",
      status: "active",
    },
  ])

  const handleEditUser = (userId: number) => {
    alert(`Editing user with ID: ${userId}`)
    // In a real app, this would open a modal or navigate to an edit page
  }

  const handleAddUser = () => {
    alert("Opening user creation form...")
    // In a real app, this would open a modal or navigate to a creation page
  }

  const handleUserSearch = (query: string) => {
    // In a real app, this would filter users from the database
    alert(`Searching for users matching: ${query}`)
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">System Administration Panel</p>
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
        {/* System Overview */}
        <div className="grid md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
              <p className="text-xs text-gray-600">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.activeStudents}</div>
              <p className="text-xs text-gray-600">88% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecturers</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{systemStats.lecturers}</div>
              <p className="text-xs text-gray-600">All departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Health Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{systemStats.healthChats}</div>
              <p className="text-xs text-gray-600">Active today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{systemStats.attendanceToday}%</div>
              <p className="text-xs text-gray-600">Today's average</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Admin Features */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="health">Health Monitoring</TabsTrigger>
            <TabsTrigger value="system">System Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    User Management
                    <Button onClick={handleAddUser}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </CardTitle>
                  <CardDescription>Manage students, lecturers, and administrators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input placeholder="Search users..." onChange={(e) => handleUserSearch(e.target.value)} />
                      </div>
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{user.name}</h3>
                            {user.matricNumber && (
                              <p className="text-sm text-gray-600">
                                {user.matricNumber} • {user.department}
                              </p>
                            )}
                            {!user.matricNumber && <p className="text-sm text-gray-600">{user.department}</p>}
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge>{user.role}</Badge>
                            <Badge className="bg-green-100 text-green-800">{user.status}</Badge>
                            <Button variant="outline" size="sm" onClick={() => handleEditUser(user.id)}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage course materials, announcements, and system content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Course Materials</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span>Computer Science Resources</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-4 w-4 text-green-600" />
                          <span>Engineering Materials</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">System Announcements</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium">System Maintenance</p>
                        <p className="text-xs text-gray-600">Scheduled for this weekend</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium">New Feature Release</p>
                        <p className="text-xs text-gray-600">Enhanced campus map available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health System Monitoring</CardTitle>
                <CardDescription>Monitor healthcare chats and student health records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Active Health Chats</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Student: ACU/2023/045</p>
                            <p className="text-sm text-gray-600">Started: 2 hours ago</p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Student: ACU/2023/078</p>
                            <p className="text-sm text-gray-600">Started: 30 minutes ago</p>
                          </div>
                          <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Health Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Total Consultations Today</span>
                          <Badge>23</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Average Response Time</span>
                          <Badge className="bg-green-100 text-green-800">5 minutes</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Urgent Cases</span>
                          <Badge className="bg-red-100 text-red-800">2</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Database Configuration</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="db-host">Database Host</Label>
                        <Input id="db-host" value="mongodb://localhost:27017" readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="db-name">Database Name</Label>
                        <Input id="db-name" value="acu_student_portal" readOnly />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">System Status</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Database</span>
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Authentication</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>File Storage</span>
                        <Badge className="bg-green-100 text-green-800">Available</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Comprehensive system usage and performance analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Usage Statistics</h3>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Usage analytics chart would go here</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span>Average Response Time</span>
                          <Badge className="bg-green-100 text-green-800">120ms</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span>System Uptime</span>
                          <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span>Daily Active Users</span>
                          <Badge className="bg-blue-100 text-blue-800">1,045</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <span>Storage Usage</span>
                          <Badge className="bg-yellow-100 text-yellow-800">67%</Badge>
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
