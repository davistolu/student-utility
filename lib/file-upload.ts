import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export interface UploadResult {
  success: boolean
  fileName?: string
  filePath?: string
  fileSize?: number
  error?: string
}

export interface FileUploadOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  uploadDir?: string
}

const DEFAULT_OPTIONS: FileUploadOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/avi",
    "video/quicktime",
  ],
  uploadDir: "public/uploads",
}

export async function uploadFile(
  file: File,
  subDir = "materials",
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
    const uploadPath = path.join(process.cwd(), opts.uploadDir!, subDir)
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true })
    }

    // Full file path
    const filePath = path.join(uploadPath, uniqueFileName)
    const relativePath = path.join(opts.uploadDir!, subDir, uniqueFileName).replace(/\\/g, "/")

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to disk
    await writeFile(filePath, buffer)

    return {
      success: true,
      fileName: uniqueFileName,
      filePath: `/${relativePath}`,
      fileSize: file.size,
    }
  } catch (error) {
    console.error("File upload error:", error)
    return {
      success: false,
      error: "Failed to upload file",
    }
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
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "image",
    ".mp4": "video",
    ".avi": "video",
    ".mov": "video",
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
