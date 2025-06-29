"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Fingerprint, CheckCircle, Users, AlertCircle, Scan, Loader2 } from "lucide-react"

interface AttendanceSystemProps {
  userRole: "student" | "lecturer" | "admin"
  userId: string
}

export default function AttendanceSystem({ userRole, userId }: AttendanceSystemProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attendanceData, setAttendanceData] = useState({
    records: [],
    stats: { present: 0, total: 0, percentage: 0 },
  })

  useEffect(() => {
    loadAttendanceData()
  }, [userId])

  const loadAttendanceData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("auth-token")

      const response = await fetch(`/api/attendance?studentId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const records = data.data || []

        // Calculate stats
        const present = records.filter((r: any) => r.status === "present").length
        const total = records.length
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0

        setAttendanceData({
          records: records.slice(0, 5), // Show last 5 records
          stats: { present, total, percentage },
        })
      } else {
        setError("Failed to load attendance data")
      }
    } catch (error) {
      console.error("Load attendance error:", error)
      setError("Failed to load attendance data")
    } finally {
      setLoading(false)
    }
  }

  const simulateFingerprint = async () => {
    setIsScanning(true)
    setScanResult(null)
    setError("")

    try {
      // Simulate fingerprint data
      const fingerprintData = Array.from({ length: 20 }, () => Math.floor(Math.random() * 256))

      // Call the attendance API
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseCode: "CS301", // In a real app, this would be selected by the user
          fingerprintData,
          location: "Room 204",
        }),
      })

      const data = await response.json()

      setTimeout(() => {
        setIsScanning(false)

        if (data.success) {
          setScanResult("success")
          // Reload attendance data
          loadAttendanceData()
        } else {
          setScanResult("error")
          setError(data.message || "Fingerprint verification failed")
        }
      }, 3000)
    } catch (error) {
      console.error("Fingerprint error:", error)
      setIsScanning(false)
      setScanResult("error")
      setError("An error occurred during fingerprint scanning")
    }
  }

  if (userRole === "student") {
    return (
      <div className="space-y-6">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Fingerprint Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Fingerprint className="h-5 w-5" />
              <span>Biometric Attendance</span>
            </CardTitle>
            <CardDescription>Place your finger on the scanner to mark attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center relative overflow-hidden">
                {isScanning ? (
                  <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse rounded-full" />
                ) : null}
                <Fingerprint className={`h-16 w-16 ${isScanning ? "text-blue-600 animate-pulse" : "text-blue-500"}`} />
              </div>

              {scanResult === "success" && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Attendance Marked Successfully!</span>
                </div>
              )}

              {scanResult === "error" && (
                <div className="flex items-center justify-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Verification Failed!</span>
                </div>
              )}

              <Button onClick={simulateFingerprint} disabled={isScanning} className="w-full">
                {isScanning ? (
                  <>
                    <Scan className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Fingerprint className="h-4 w-4 mr-2" />
                    Scan Fingerprint
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Attendance</span>
                  <span className="text-2xl font-bold text-green-600">{attendanceData.stats.percentage}%</span>
                </div>
                <Progress value={attendanceData.stats.percentage} className="h-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{attendanceData.stats.present} classes attended</span>
                  <span>{attendanceData.stats.total - attendanceData.stats.present} classes missed</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {attendanceData.records.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No attendance records found</p>
                ) : (
                  attendanceData.records.map((record: any, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{record.courseCode}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.timestamp).toLocaleDateString()} at{" "}
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          record.status === "present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Lecturer View (simplified for now)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Live Attendance - CS 301</span>
            </div>
            <Badge className="bg-green-100 text-green-800">45/50 Present</Badge>
          </CardTitle>
          <CardDescription>Students are automatically added as they scan their fingerprints</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Lecturer attendance view - Coming soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
