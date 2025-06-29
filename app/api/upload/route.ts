import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { uploadFile, getFileType } from "@/lib/file-upload"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const courseCode = formData.get("courseCode") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const uploadedBy = formData.get("uploadedBy") as string
    const tags = formData.get("tags") as string

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
    }

    if (!courseCode || !title || !uploadedBy) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Upload file to filesystem
    const uploadResult = await uploadFile(file, "materials")

    if (!uploadResult.success) {
      return NextResponse.json({ success: false, message: uploadResult.error }, { status: 400 })
    }

    // Save file metadata to database
    const db = await getDatabase()
    const fileMetadata = {
      _id: new ObjectId(),
      title,
      description: description || "",
      courseCode,
      type: getFileType(file.name),
      originalFileName: file.name,
      fileName: uploadResult.fileName,
      filePath: uploadResult.filePath,
      fileSize: uploadResult.fileSize,
      uploadedBy: new ObjectId(uploadedBy),
      uploadDate: new Date(),
      downloads: 0,
      rating: 0,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("materials").insertOne(fileMetadata)

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        id: result.insertedId,
        ...fileMetadata,
      },
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ success: false, message: "Server error during upload" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseCode = searchParams.get("courseCode")
    const uploadedBy = searchParams.get("uploadedBy")
    const type = searchParams.get("type")

    const db = await getDatabase()
    const query: any = { isPublic: true }

    if (courseCode) query.courseCode = courseCode
    if (uploadedBy) query.uploadedBy = new ObjectId(uploadedBy)
    if (type) query.type = type

    const materials = await db.collection("materials").find(query).sort({ uploadDate: -1 }).toArray()

    return NextResponse.json({
      success: true,
      data: materials,
    })
  } catch (error) {
    console.error("Get uploads API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
