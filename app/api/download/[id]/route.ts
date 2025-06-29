import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { readFile } from "fs/promises"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid file ID" }, { status: 400 })
    }

    const db = await getDatabase()
    const material = await db.collection("materials").findOne({
      _id: new ObjectId(id),
    })

    if (!material) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 })
    }

    // Increment download count
    await db.collection("materials").updateOne({ _id: new ObjectId(id) }, { $inc: { downloads: 1 } })

    // Read file from filesystem
    const filePath = path.join(process.cwd(), "public", material.filePath)
    const fileBuffer = await readFile(filePath)

    // Set appropriate headers
    const headers = new Headers()
    headers.set("Content-Type", "application/octet-stream")
    headers.set("Content-Disposition", `attachment; filename="${material.originalFileName}"`)
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
