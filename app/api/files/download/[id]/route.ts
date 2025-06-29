import { type NextRequest, NextResponse } from "next/server"
import { getFileById, incrementDownloadCount } from "@/lib/file-upload-enhanced"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const file = await getFileById(id)
    if (!file) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 })
    }

    // Check if file is public or user has access
    // In a real app, you'd check user permissions here

    // Increment download count
    await incrementDownloadCount(id)

    // Read file from filesystem
    const filePath = path.join(process.cwd(), "public", file.filePath)
    const fileBuffer = await readFile(filePath)

    // Set appropriate headers
    const headers = new Headers()
    headers.set("Content-Type", file.mimeType || "application/octet-stream")
    headers.set("Content-Disposition", `attachment; filename="${file.originalName}"`)
    headers.set("Content-Length", fileBuffer.length.toString())

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Download API error:", error)
    return NextResponse.json({ success: false, message: "Server error during download" }, { status: 500 })
  }
}
