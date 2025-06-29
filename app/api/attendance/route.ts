import { NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const courseCode = searchParams.get("courseCode")
    const date = searchParams.get("date")
    const studentId = searchParams.get("studentId")

    const db = await getDatabase()
    const query: any = {}

    if (courseCode) query.courseCode = courseCode
    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) }
    if (studentId) query.studentId = new ObjectId(studentId)

    // If user is a student, only show their own attendance
    if (req.user!.role === "student") {
      query.studentId = new ObjectId(req.user!.userId)
    }

    const attendance = await db.collection("attendance").find(query).sort({ timestamp: -1 }).toArray()

    return NextResponse.json({
      success: true,
      data: attendance,
    })
  } catch (error) {
    console.error("Get attendance API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
})

export const POST = withAuth(async (req) => {
  try {
    const { courseCode, fingerprintData, location } = await req.json()

    if (!courseCode) {
      return NextResponse.json({ success: false, message: "Course code is required" }, { status: 400 })
    }

    // Simulate fingerprint verification
    const isValidFingerprint = fingerprintData && fingerprintData.length > 10

    if (!isValidFingerprint) {
      return NextResponse.json({ success: false, message: "Fingerprint verification failed" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if attendance already marked today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingAttendance = await db.collection("attendance").findOne({
      studentId: new ObjectId(req.user!.userId),
      courseCode,
      timestamp: { $gte: today, $lt: tomorrow },
    })

    if (existingAttendance) {
      return NextResponse.json({ success: false, message: "Attendance already marked for today" }, { status: 400 })
    }

    // Create attendance record
    const attendanceRecord = {
      _id: new ObjectId(),
      studentId: new ObjectId(req.user!.userId),
      courseCode,
      date: today,
      status: "present",
      timestamp: new Date(),
      location: location || "Unknown",
      fingerprintVerified: true,
      createdAt: new Date(),
    }

    await db.collection("attendance").insertOne(attendanceRecord)

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
      data: attendanceRecord,
    })
  } catch (error) {
    console.error("Mark attendance API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
})
