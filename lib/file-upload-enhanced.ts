import { writeFile, mkdir, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export interface FileMetadata {
  _id?: ObjectId
  originalName: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  fileType: string
  uploadedBy: ObjectId
  courseCode?: string
  title?: string
  description?: string
  tags: string[]
  category: "material" | "assignment" | "profile" | "other"
  isPublic: boolean
  downloads: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface UploadResult {
  success: boolean
  file?: FileMetadata
  error?: string
}

export interface FileUploadOptions {
  maxSize?: number
  allowedTypes?: string[]
  uploadDir?: string
  category?: "material" | "assignment" | "profile" | "other"
}

const DEFAULT_OPTIONS: FileUploadOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/avi",
    "video/quicktime",
    "audio/mpeg",
    "audio/wav",
    "text/plain",
    "application/zip",
    "application/x-rar-compressed",
  ],
  uploadDir: "public/uploads",
  category: "material",
}

export async function uploadFileToDatabase(
  file: File,
  uploadedBy: string,
  metadata: {
    title?: string
    description?: string
    courseCode?: string
    tags?: string[]
    category?: "material" | "assignment" | "profile" | "other"
    isPublic?: boolean
  },
  options: FileUploadOptions = {},
): Promise<UploadResult> {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Validate file size
    if (file.size > opts.maxSize!) {
      return {
        success: false,
        error: `File size exceeds maximum limit of ${opts.maxSize! / 1024 / 1024}MB`,
      }
    }

    // Validate file type
    if (opts.allowedTypes && !opts.allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed`,
      }
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const uniqueFileName = `${uuidv4()}${fileExtension}`

    // Create upload directory structure
    const subDir = metadata.category || "material"
    const uploadPath = path.join(process.cwd(), opts.uploadDir!, subDir)

    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // Full file path
    const filePath = path.join(uploadPath, uniqueFileName)
    const relativePath = path.join(opts.uploadDir!, subDir, uniqueFileName).replace(/\\/g, "/")

    // Convert File to Buffer and write to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create file metadata
    const fileMetadata: FileMetadata = {
      _id: new ObjectId(),
      originalName: file.name,
      fileName: uniqueFileName,
      filePath: `/${relativePath}`,
      fileSize: file.size,
      mimeType: file.type,
      fileType: getFileType(file.name),
      uploadedBy: new ObjectId(uploadedBy),
      courseCode: metadata.courseCode || null,
      title: metadata.title || file.name,
      description: metadata.description || "",
      tags: metadata.tags || [],
      category: metadata.category || "material",
      isPublic: metadata.isPublic !== false,
      downloads: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to database
    const db = await getDatabase()
    const result = await db.collection("file_uploads").insertOne(fileMetadata)

    fileMetadata._id = result.insertedId

    return {
      success: true,
      file: fileMetadata,
    }
  } catch (error) {
    console.error("File upload error:", error)
    return {
      success: false,
      error: "Failed to upload file",
    }
  }
}

export async function getFileById(fileId: string): Promise<FileMetadata | null> {
  try {
    const db = await getDatabase()
    const file = await db.collection("file_uploads").findOne({
      _id: new ObjectId(fileId),
    })
    return file as FileMetadata | null
  } catch (error) {
    console.error("Get file error:", error)
    return null
  }
}

export async function getFilesByUser(userId: string, category?: string): Promise<FileMetadata[]> {
  try {
    const db = await getDatabase()
    const query: any = { uploadedBy: new ObjectId(userId) }

    if (category) {
      query.category = category
    }

    const files = await db.collection("file_uploads").find(query).sort({ createdAt: -1 }).toArray()

    return files as FileMetadata[]
  } catch (error) {
    console.error("Get files by user error:", error)
    return []
  }
}

export async function getFilesByCourse(courseCode: string): Promise<FileMetadata[]> {
  try {
    const db = await getDatabase()
    const files = await db
      .collection("file_uploads")
      .find({
        courseCode,
        isPublic: true,
        category: "material",
      })
      .sort({ createdAt: -1 })
      .toArray()

    return files as FileMetadata[]
  } catch (error) {
    console.error("Get files by course error:", error)
    return []
  }
}

export async function incrementDownloadCount(fileId: string): Promise<boolean> {
  try {
    const db = await getDatabase()
    const result = await db.collection("file_uploads").updateOne(
      { _id: new ObjectId(fileId) },
      {
        $inc: { downloads: 1 },
        $set: { updatedAt: new Date() },
      },
    )
    return result.modifiedCount > 0
  } catch (error) {
    console.error("Increment download error:", error)
    return false
  }
}

export async function deleteFile(fileId: string, userId: string): Promise<boolean> {
  try {
    const db = await getDatabase()

    // Get file metadata
    const file = await getFileById(fileId)
    if (!file || file.uploadedBy.toString() !== userId) {
      return false
    }

    // Delete from filesystem
    const fullPath = path.join(process.cwd(), "public", file.filePath)
    try {
      await unlink(fullPath)
    } catch (error) {
      console.warn("File not found on filesystem:", fullPath)
    }

    // Delete from database
    const result = await db.collection("file_uploads").deleteOne({
      _id: new ObjectId(fileId),
    })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Delete file error:", error)
    return false
  }
}

export function getFileType(fileName: string): string {
  const extension = path.extname(fileName).toLowerCase()

  const typeMap: { [key: string]: string } = {
    ".pdf": "pdf",
    ".doc": "document",
    ".docx": "document",
    ".ppt": "presentation",
    ".pptx": "presentation",
    ".xls": "spreadsheet",
    ".xlsx": "spreadsheet",
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "image",
    ".webp": "image",
    ".mp4": "video",
    ".avi": "video",
    ".mov": "video",
    ".mp3": "audio",
    ".wav": "audio",
    ".txt": "text",
    ".zip": "archive",
    ".rar": "archive",
  }

  return typeMap[extension] || "unknown"
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
