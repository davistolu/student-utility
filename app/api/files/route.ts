import { NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { getFilesByUser, getFilesByCourse } from "@/lib/file-upload-enhanced"

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const courseCode = searchParams.get("courseCode")
    const category = searchParams.get("category")
    const myFiles = searchParams.get("myFiles") === "true"

    let files = []

    if (myFiles) {
      files = await getFilesByUser(req.user!.userId, category || undefined)
    } else if (courseCode) {
      files = await getFilesByCourse(courseCode)
    } else {
      // Get all public files
      files = await getFilesByUser(req.user!.userId)
    }

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error("Get files API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
})
