"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload, type File, X, CheckCircle, AlertCircle } from "lucide-react"

interface FileUploadProps {
  courseCode?: string
  uploadedBy: string
  onUploadComplete?: (file: any) => void
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

export default function FileUpload({ courseCode, uploadedBy, onUploadComplete }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCourse, setSelectedCourse] = useState(courseCode || "")
  const [tags, setTags] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const courses = [
    { code: "CS301", name: "Data Structures & Algorithms" },
    { code: "CS401", name: "Software Engineering" },
    { code: "CS302", name: "Database Systems" },
    { code: "ENG201", name: "Engineering Mathematics" },
    { code: "MED101", name: "Human Anatomy" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])

    const newFiles: UploadFile[] = selectedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const uploadFile = async (uploadFile: UploadFile) => {
    const formData = new FormData()
    formData.append("file", uploadFile.file)
    formData.append("title", title || uploadFile.file.name)
    formData.append("description", description)
    formData.append("courseCode", selectedCourse)
    formData.append("uploadedBy", uploadedBy)
    formData.append("tags", tags)

    try {
      // Update file status to uploading
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading" as const, progress: 0 } : f)),
      )

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f)),
        )
      }, 200)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      const result = await response.json()

      if (result.success) {
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "success" as const, progress: 100 } : f)),
        )

        if (onUploadComplete) {
          onUploadComplete(result.data)
        }
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error" as const, error: result.message } : f)),
        )
      }
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error" as const, error: "Upload failed" } : f)),
      )
    }
  }

  const handleUpload = async () => {
    if (!selectedCourse || !title.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setIsUploading(true)

    // Upload all pending files
    const pendingFiles = files.filter((f) => f.status === "pending")

    for (const file of pendingFiles) {
      await uploadFile(file)
    }

    setIsUploading(false)

    // Clear form if all uploads successful
    const allSuccessful = files.every((f) => f.status === "success")
    if (allSuccessful) {
      setTitle("")
      setDescription("")
      setTags("")
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes("pdf")) return "📄"
    if (file.type.includes("image")) return "🖼️"
    if (file.type.includes("video")) return "🎥"
    if (file.type.includes("word")) return "📝"
    if (file.type.includes("powerpoint")) return "📊"
    return "📁"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Course Materials</span>
        </CardTitle>
        <CardDescription>Upload documents, videos, and other course materials for students</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Selection */}
        <div>
          <Label htmlFor="file-upload">Select Files</Label>
          <div className="mt-2">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to select files or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PDF, DOC, PPT, Images, Videos (Max 10MB each)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
            />
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files</Label>
            {files.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <span className="text-2xl">{getFileIcon(uploadFile.file)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(uploadFile.file.size)}</p>

                  {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="h-1 mt-1" />}

                  {uploadFile.status === "error" && <p className="text-xs text-red-600 mt-1">{uploadFile.error}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  {uploadFile.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {uploadFile.status === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
                  {uploadFile.status === "pending" && (
                    <Button variant="ghost" size="sm" onClick={() => removeFile(uploadFile.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter material title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course *</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.code} value={course.code}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter material description (optional)"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas (e.g., algorithms, sorting, complexity)"
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || !selectedCourse || !title.trim() || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload {files.length} File{files.length !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
