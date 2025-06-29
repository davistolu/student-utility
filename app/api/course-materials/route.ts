import { type NextRequest, NextResponse } from "next/server"

// Simulated course materials database
const materials = [
  {
    id: "material_001",
    title: "Introduction to Binary Trees",
    courseCode: "CS301",
    type: "pdf",
    uploadedBy: "lecturer_001",
    uploadDate: new Date("2024-01-10").toISOString(),
    fileUrl: "/materials/binary_trees.pdf",
    downloads: 145,
    rating: 4.8,
    tags: ["trees", "data-structures", "algorithms"],
  },
  {
    id: "material_002",
    title: "Sorting Algorithms Lecture",
    courseCode: "CS301",
    type: "video",
    uploadedBy: "lecturer_001",
    uploadDate: new Date("2024-01-08").toISOString(),
    fileUrl: "/materials/sorting_algorithms.mp4",
    downloads: 89,
    rating: 4.6,
    tags: ["sorting", "algorithms", "complexity"],
  },
  {
    id: "material_003",
    title: "Software Development Lifecycle",
    courseCode: "CS401",
    type: "pdf",
    uploadedBy: "lecturer_002",
    uploadDate: new Date("2024-01-05").toISOString(),
    fileUrl: "/materials/sdlc.pdf",
    downloads: 67,
    rating: 4.9,
    tags: ["software-engineering", "development", "lifecycle"],
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseCode = searchParams.get("course")
  const materialId = searchParams.get("id")
  const type = searchParams.get("type")

  if (materialId) {
    const material = materials.find((m) => m.id === materialId)
    if (material) {
      return NextResponse.json({
        success: true,
        data: material,
      })
    } else {
      return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 })
    }
  }

  let filteredMaterials = materials

  if (courseCode) {
    filteredMaterials = filteredMaterials.filter((m) => m.courseCode === courseCode)
  }

  if (type) {
    filteredMaterials = filteredMaterials.filter((m) => m.type === type)
  }

  return NextResponse.json({
    success: true,
    data: filteredMaterials,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { title, courseCode, type, uploadedBy, fileUrl, tags, action, materialId } = await request.json()

    if (action === "download") {
      // Increment download count
      if (!materialId) {
        return NextResponse.json({ success: false, message: "Material ID is required" }, { status: 400 })
      }

      const material = materials.find((m) => m.id === materialId)
      if (!material) {
        return NextResponse.json({ success: false, message: "Material not found" }, { status: 404 })
      }

      material.downloads += 1

      return NextResponse.json({
        success: true,
        message: "Download count updated",
        data: material,
      })
    }

    if (action === "upload") {
      // Upload new material
      if (!title || !courseCode || !type || !uploadedBy || !fileUrl) {
        return NextResponse.json(
          { success: false, message: "Missing required fields for material upload" },
          { status: 400 },
        )
      }

      const newMaterial = {
        id: `material_${Date.now()}`,
        title,
        courseCode,
        type,
        uploadedBy,
        uploadDate: new Date().toISOString(),
        fileUrl,
        downloads: 0,
        rating: 0,
        tags: tags || [],
      }

      materials.push(newMaterial)

      return NextResponse.json({
        success: true,
        message: "Material uploaded successfully",
        data: newMaterial,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Course materials API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
