import { NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { uploadFileToDatabase } from "@/lib/file-upload-enhanced"

export const POST = withAuth(async (req) => {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const courseCode = formData.get("courseCode") as string
    const tags = formData.get("tags") as string
    const category = formData.get("category") as "material" | "assignment" | "profile" | "other"
    const isPublic = formData.get("isPublic") === "true"

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
    }

    const result = await uploadFileToDatabase(file, req.user!.userId, {
      title,
      description,
      courseCode,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      category: category || "material",
      isPublic,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      file: result.file,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ success: false, message: "Server error during upload" }, { status: 500 })
  }
})
