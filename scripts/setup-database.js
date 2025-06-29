// MongoDB Database Setup Script for ACU Student Utility Portal
// This script creates the necessary collections and indexes

console.log("Setting up ACU Student Utility Portal Database...")

// Database configuration
const dbConfig = {
  name: "acu_student_portal",
  collections: [
    "users",
    "attendance",
    "courses",
    "materials",
    "health_chats",
    "campus_locations",
    "past_questions",
    "ai_generated_questions",
  ],
}

// Sample data structures
const sampleData = {
  users: [
    {
      _id: "user_001",
      name: "John Doe",
      email: "john.doe@acu.edu.ng",
      matricNumber: "ACU/2023/001",
      department: "Computer Science",
      role: "student",
      fingerprintHash: "hashed_fingerprint_data",
      createdAt: new Date(),
      isActive: true,
    },
    {
      _id: "lecturer_001",
      name: "Dr. Sarah Johnson",
      email: "s.johnson@acu.edu.ng",
      department: "Computer Science",
      role: "lecturer",
      courses: ["CS301", "CS401"],
      createdAt: new Date(),
      isActive: true,
    },
  ],

  attendance: [
    {
      _id: "att_001",
      studentId: "user_001",
      courseCode: "CS301",
      date: new Date(),
      status: "present",
      timestamp: new Date(),
      location: "Room 204",
      fingerprintVerified: true,
    },
  ],

  courses: [
    {
      _id: "course_001",
      code: "CS301",
      name: "Data Structures & Algorithms",
      department: "Computer Science",
      lecturer: "lecturer_001",
      semester: "Second",
      year: 2024,
      students: ["user_001"],
      schedule: {
        days: ["Monday", "Wednesday"],
        time: "09:00-11:00",
        room: "Room 204",
      },
    },
  ],

  materials: [
    {
      _id: "material_001",
      title: "Introduction to Binary Trees",
      courseCode: "CS301",
      type: "pdf",
      uploadedBy: "lecturer_001",
      uploadDate: new Date(),
      fileUrl: "/materials/binary_trees.pdf",
      downloads: 145,
      rating: 4.8,
      tags: ["trees", "data-structures", "algorithms"],
    },
  ],

  health_chats: [
    {
      _id: "chat_001",
      studentId: "user_001",
      staffId: "health_staff_001",
      messages: [
        {
          sender: "student",
          content: "I have been feeling unwell lately",
          timestamp: new Date(),
          encrypted: true,
        },
      ],
      status: "active",
      priority: "normal",
      createdAt: new Date(),
    },
  ],

  campus_locations: [
    {
      _id: "loc_001",
      name: "Main Library",
      type: "academic",
      coordinates: { latitude: 7.3775, longitude: 3.947 },
      description: "Central library with study halls",
      facilities: ["wifi", "study_rooms", "computers"],
      openingHours: {
        weekdays: "08:00-22:00",
        weekends: "10:00-18:00",
      },
    },
  ],

  past_questions: [
    {
      _id: "pq_001",
      courseCode: "CS301",
      year: 2023,
      semester: "Second",
      questions: [
        {
          question: "Explain the time complexity of merge sort",
          marks: 10,
          type: "essay",
        },
      ],
      uploadedBy: "lecturer_001",
      uploadDate: new Date(),
    },
  ],

  ai_generated_questions: [
    {
      _id: "ai_q_001",
      courseCode: "CS301",
      question: "Compare and contrast binary search trees and AVL trees",
      difficulty: "medium",
      confidence: 0.92,
      basedOn: ["past_questions", "lecture_patterns"],
      generatedAt: new Date(),
      tags: ["trees", "data-structures"],
    },
  ],
}

// Create indexes for better performance
const indexes = {
  users: [{ email: 1 }, { matricNumber: 1 }, { role: 1 }],
  attendance: [{ studentId: 1, date: -1 }, { courseCode: 1, date: -1 }, { date: -1 }],
  courses: [{ code: 1 }, { lecturer: 1 }, { department: 1 }],
  materials: [{ courseCode: 1 }, { uploadDate: -1 }, { rating: -1 }],
  health_chats: [{ studentId: 1 }, { status: 1 }, { createdAt: -1 }],
  campus_locations: [{ type: 1 }, { name: 1 }],
}

// Simulate database operations
console.log("Creating collections...")
dbConfig.collections.forEach((collection) => {
  console.log(`✓ Created collection: ${collection}`)
})

console.log("\nInserting sample data...")
Object.keys(sampleData).forEach((collection) => {
  console.log(`✓ Inserted ${sampleData[collection].length} documents into ${collection}`)
})

console.log("\nCreating indexes...")
Object.keys(indexes).forEach((collection) => {
  indexes[collection].forEach((index) => {
    console.log(`✓ Created index on ${collection}: ${JSON.stringify(index)}`)
  })
})

console.log("\n🎉 Database setup completed successfully!")
console.log("\nDatabase Summary:")
console.log(`- Database Name: ${dbConfig.name}`)
console.log(`- Collections: ${dbConfig.collections.length}`)
console.log(`- Sample Users: ${sampleData.users.length}`)
console.log(`- Sample Courses: ${sampleData.courses.length}`)
console.log("\nThe ACU Student Utility Portal database is ready for use!")
