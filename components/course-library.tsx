"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Search, Download, Brain, FileText, Video, Star, Clock, TrendingUp, Zap } from "lucide-react"
import FileUpload from "./file-upload"

interface CourseLibraryProps {
  userRole: "student" | "lecturer" | "admin"
}

const courses = [
  {
    id: 1,
    code: "CS 301",
    name: "Data Structures & Algorithms",
    materials: 24,
    pastQuestions: 15,
    aiGenerated: 8,
    progress: 75,
  },
  {
    id: 2,
    code: "CS 401",
    name: "Software Engineering",
    materials: 18,
    pastQuestions: 12,
    aiGenerated: 6,
    progress: 60,
  },
  {
    id: 3,
    code: "CS 302",
    name: "Database Systems",
    materials: 20,
    pastQuestions: 10,
    aiGenerated: 5,
    progress: 45,
  },
]

const materialsData = [
  {
    id: 1,
    title: "Introduction to Binary Trees",
    type: "pdf",
    course: "CS 301",
    uploadDate: "2024-01-10",
    downloads: 145,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Sorting Algorithms Lecture",
    type: "video",
    course: "CS 301",
    uploadDate: "2024-01-08",
    downloads: 89,
    rating: 4.6,
  },
  {
    id: 3,
    title: "Software Development Lifecycle",
    type: "pdf",
    course: "CS 401",
    uploadDate: "2024-01-05",
    downloads: 67,
    rating: 4.9,
  },
]

const aiGeneratedQuestionsData = [
  {
    id: 1,
    question: "Explain the time complexity of merge sort and provide a detailed analysis.",
    course: "CS 301",
    difficulty: "Medium",
    confidence: 92,
    basedOn: "Past 5 exams + Lecture patterns",
  },
  {
    id: 2,
    question: "Compare and contrast Agile and Waterfall methodologies in software development.",
    course: "CS 401",
    difficulty: "Hard",
    confidence: 88,
    basedOn: "Lecturer emphasis + Past questions",
  },
  {
    id: 3,
    question: "Design a database schema for a university management system.",
    course: "CS 302",
    difficulty: "Hard",
    confidence: 85,
    basedOn: "Assignment patterns + Exam trends",
  },
]

export default function CourseLibrary({ userRole }: CourseLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [materials, setMaterials] = useState(materialsData)
  const [aiGeneratedQuestions, setAiGeneratedQuestions] = useState(aiGeneratedQuestionsData)

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCourse === "all" || material.course === selectedCourse),
  )

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "video":
        return <Video className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDownload = async (material: any) => {
    try {
      const response = await fetch(`/api/download/${material.id}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = material.title
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        // Update download count in UI
        setMaterials((prev) => prev.map((m) => (m.id === material.id ? { ...m, downloads: m.downloads + 1 } : m)))
      } else {
        alert("Download failed")
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("Download failed")
    }
  }

  const generateAIQuestions = (courseCode: string) => {
    // In a real app, this would call an AI service
    alert(`Generating AI questions for ${courseCode}...`)

    // Simulate AI generation
    setTimeout(() => {
      const newQuestions = [
        {
          id: Date.now(),
          question: `Explain the implementation of ${courseCode === "CS301" ? "quick sort" : "database normalization"} and analyze its performance characteristics.`,
          course: courseCode,
          difficulty: "Medium",
          confidence: 94,
          basedOn: "Recent lecture patterns + textbook emphasis",
        },
        {
          id: Date.now() + 1,
          question: `Compare and contrast ${courseCode === "CS301" ? "binary trees and AVL trees" : "SQL and NoSQL databases"} with practical examples.`,
          course: courseCode,
          difficulty: "Hard",
          confidence: 87,
          basedOn: "Past exam questions + assignment patterns",
        },
      ]

      // Add new questions to the list
      setAiGeneratedQuestions((prev) => [...newQuestions, ...prev])

      alert("New practice questions generated successfully!")
    }, 2000)
  }

  if (userRole === "lecturer") {
    return (
      <div className="space-y-6">
        {/* File Upload Section */}
        <FileUpload
          uploadedBy="lecturer_001" // In real app, get from user context
          onUploadComplete={(file) => {
            // Refresh materials list
            setMaterials((prev) => [file, ...prev])
            alert("File uploaded successfully!")
          }}
        />

        {/* Materials Management */}
        <Card>
          <CardHeader>
            <CardTitle>Your Course Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getFileIcon(material.type)}
                    <div>
                      <h3 className="font-medium">{material.title}</h3>
                      <p className="text-sm text-gray-600">
                        {material.course} • {material.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{material.downloads} downloads</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{material.rating}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Student View
  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{course.code}</CardTitle>
              <CardDescription>{course.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{course.materials}</div>
                    <div className="text-xs text-gray-600">Materials</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{course.pastQuestions}</div>
                    <div className="text-xs text-gray-600">Past Q's</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{course.aiGenerated}</div>
                    <div className="text-xs text-gray-600">AI Gen</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="materials">Course Materials</TabsTrigger>
          <TabsTrigger value="questions">Past Questions</TabsTrigger>
          <TabsTrigger value="ai-prep">AI Exam Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Materials</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search materials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      {getFileIcon(material.type)}
                      <div>
                        <h3 className="font-medium">{material.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{material.course}</span>
                          <span>•</span>
                          <span>{material.uploadDate}</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{material.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{material.downloads} downloads</Badge>
                      <Button size="sm" onClick={() => handleDownload(material)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Past Questions Archive</CardTitle>
              <CardDescription>Access previous exam questions and practice tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Recent Exams</h3>
                  {[
                    { year: "2023", semester: "Second", questions: 25 },
                    { year: "2023", semester: "First", questions: 22 },
                    { year: "2022", semester: "Second", questions: 28 },
                  ].map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {exam.year} - {exam.semester} Semester
                        </p>
                        <p className="text-sm text-gray-600">{exam.questions} questions</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Practice Tests</h3>
                  {[
                    { name: "Midterm Practice", questions: 15, time: "45 min" },
                    { name: "Final Exam Prep", questions: 30, time: "90 min" },
                    { name: "Quick Quiz", questions: 10, time: "20 min" },
                  ].map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-gray-600">
                          {test.questions} questions • {test.time}
                        </p>
                      </div>
                      <Button size="sm">Start Test</Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-prep">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span>AI-Powered Exam Preparation</span>
              </CardTitle>
              <CardDescription>Smart question generation based on past exams and lecturer patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* AI Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <p className="text-sm text-gray-600">Questions Generated</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">89%</div>
                    <p className="text-sm text-gray-600">Accuracy Rate</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <p className="text-sm text-gray-600">Study Sessions</p>
                  </div>
                </div>

                {/* Generated Questions */}
                <div>
                  <h3 className="text-lg font-medium mb-4">AI-Generated Practice Questions</h3>
                  <div className="space-y-4">
                    {aiGeneratedQuestions.map((q) => (
                      <div key={q.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{q.question}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <span>{q.course}</span>
                              <Badge className={getDifficultyColor(q.difficulty)}>{q.difficulty}</Badge>
                              <div className="flex items-center space-x-1">
                                <Zap className="h-3 w-3 text-purple-600" />
                                <span>{q.confidence}% confidence</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Based on: {q.basedOn}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Practice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate New Questions */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Brain className="h-12 w-12 text-purple-600 mx-auto" />
                      <div>
                        <h3 className="text-lg font-medium">Generate New Questions</h3>
                        <p className="text-sm text-gray-600">
                          Our AI analyzes your course materials and past exams to create personalized practice questions
                        </p>
                      </div>
                      <div className="flex justify-center space-x-4">
                        <Button onClick={() => generateAIQuestions("CS301")}>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Generate for CS301
                        </Button>
                        <Button variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Timed Practice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
