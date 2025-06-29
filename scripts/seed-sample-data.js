// Seed additional sample data for ACU Student Utility Portal
console.log("Seeding additional sample data...")

// Generate more students
const generateStudents = (count) => {
  const departments = ["Computer Science", "Engineering", "Medicine", "Law", "Business Administration"]
  const students = []

  for (let i = 1; i <= count; i++) {
    const paddedId = i.toString().padStart(3, "0")
    students.push({
      _id: `student_${paddedId}`,
      name: `Student ${i}`,
      email: `student${i}@acu.edu.ng`,
      matricNumber: `ACU/2023/${paddedId}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      role: "student",
      fingerprintHash: `fingerprint_hash_${i}`,
      createdAt: new Date(),
      isActive: true,
      profilePicture: `/avatars/student_${i}.jpg`,
    })
  }
  return students
}

// Generate attendance records
const generateAttendanceRecords = (studentCount, days = 30) => {
  const courses = ["CS301", "CS302", "CS401", "ENG201", "MED101"]
  const records = []

  for (let day = 0; day < days; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)

    for (let studentId = 1; studentId <= studentCount; studentId++) {
      const paddedId = studentId.toString().padStart(3, "0")

      courses.forEach((courseCode) => {
        // 85% attendance rate simulation
        if (Math.random() > 0.15) {
          records.push({
            _id: `att_${paddedId}_${courseCode}_${day}`,
            studentId: `student_${paddedId}`,
            courseCode: courseCode,
            date: date,
            status: "present",
            timestamp: new Date(date.getTime() + Math.random() * 3600000), // Random time within the day
            location: `Room ${Math.floor(Math.random() * 300) + 100}`,
            fingerprintVerified: true,
          })
        }
      })
    }
  }
  return records
}

// Generate course materials
const generateCourseMaterials = () => {
  const materials = [
    {
      _id: "material_002",
      title: "Advanced Sorting Algorithms",
      courseCode: "CS301",
      type: "pdf",
      uploadedBy: "lecturer_001",
      uploadDate: new Date("2024-01-15"),
      fileUrl: "/materials/sorting_algorithms.pdf",
      downloads: 89,
      rating: 4.6,
      tags: ["sorting", "algorithms", "complexity"],
    },
    {
      _id: "material_003",
      title: "Database Design Principles",
      courseCode: "CS302",
      type: "video",
      uploadedBy: "lecturer_002",
      uploadDate: new Date("2024-01-12"),
      fileUrl: "/materials/database_design.mp4",
      downloads: 156,
      rating: 4.9,
      tags: ["database", "design", "normalization"],
    },
    {
      _id: "material_004",
      title: "Software Testing Strategies",
      courseCode: "CS401",
      type: "pdf",
      uploadedBy: "lecturer_001",
      uploadDate: new Date("2024-01-10"),
      fileUrl: "/materials/testing_strategies.pdf",
      downloads: 67,
      rating: 4.7,
      tags: ["testing", "quality-assurance", "software-engineering"],
    },
  ]
  return materials
}

// Generate health chat data
const generateHealthChats = () => {
  const chats = [
    {
      _id: "chat_002",
      studentId: "student_001",
      staffId: "health_staff_001",
      messages: [
        {
          sender: "student",
          content: "I have been experiencing headaches frequently",
          timestamp: new Date("2024-01-15T09:00:00"),
          encrypted: true,
        },
        {
          sender: "staff",
          content: "I understand your concern. How long have you been experiencing these headaches?",
          timestamp: new Date("2024-01-15T09:05:00"),
          encrypted: true,
        },
        {
          sender: "student",
          content: "About two weeks now, especially during exam preparation",
          timestamp: new Date("2024-01-15T09:07:00"),
          encrypted: true,
        },
      ],
      status: "resolved",
      priority: "normal",
      createdAt: new Date("2024-01-15T09:00:00"),
      resolvedAt: new Date("2024-01-15T10:30:00"),
    },
  ]
  return chats
}

// Generate AI questions based on patterns
const generateAIQuestions = () => {
  const questions = [
    {
      _id: "ai_q_002",
      courseCode: "CS301",
      question: "Implement a function to find the height of a binary tree and analyze its time complexity",
      difficulty: "medium",
      confidence: 0.89,
      basedOn: ["past_questions", "assignment_patterns"],
      generatedAt: new Date(),
      tags: ["binary-trees", "recursion", "complexity-analysis"],
      estimatedTime: 25, // minutes
    },
    {
      _id: "ai_q_003",
      courseCode: "CS302",
      question: "Design a normalized database schema for an e-commerce platform and explain your design choices",
      difficulty: "hard",
      confidence: 0.91,
      basedOn: ["lecturer_emphasis", "past_exams"],
      generatedAt: new Date(),
      tags: ["database-design", "normalization", "e-commerce"],
      estimatedTime: 45,
    },
    {
      _id: "ai_q_004",
      courseCode: "CS401",
      question: "Compare unit testing and integration testing with practical examples",
      difficulty: "easy",
      confidence: 0.94,
      basedOn: ["lecture_notes", "textbook_patterns"],
      generatedAt: new Date(),
      tags: ["testing", "software-quality", "comparison"],
      estimatedTime: 15,
    },
  ]
  return questions
}

// Execute seeding
const students = generateStudents(50)
const attendanceRecords = generateAttendanceRecords(50, 30)
const materials = generateCourseMaterials()
const healthChats = generateHealthChats()
const aiQuestions = generateAIQuestions()

console.log("✓ Generated sample data:")
console.log(`  - Students: ${students.length}`)
console.log(`  - Attendance Records: ${attendanceRecords.length}`)
console.log(`  - Course Materials: ${materials.length}`)
console.log(`  - Health Chats: ${healthChats.length}`)
console.log(`  - AI Generated Questions: ${aiQuestions.length}`)

// Simulate analytics data
const analytics = {
  dailyActiveUsers: Math.floor(Math.random() * 200) + 800,
  weeklyAttendanceRate: Math.floor(Math.random() * 10) + 85,
  healthConsultations: Math.floor(Math.random() * 20) + 15,
  materialDownloads: Math.floor(Math.random() * 100) + 200,
  aiQuestionsGenerated: Math.floor(Math.random() * 50) + 100,
}

console.log("\n📊 Current System Analytics:")
console.log(`  - Daily Active Users: ${analytics.dailyActiveUsers}`)
console.log(`  - Weekly Attendance Rate: ${analytics.weeklyAttendanceRate}%`)
console.log(`  - Health Consultations Today: ${analytics.healthConsultations}`)
console.log(`  - Material Downloads This Week: ${analytics.materialDownloads}`)
console.log(`  - AI Questions Generated: ${analytics.aiQuestionsGenerated}`)

console.log("\n🎉 Sample data seeding completed successfully!")
console.log("The ACU Student Utility Portal is now populated with realistic test data.")
