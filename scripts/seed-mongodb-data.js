// Enhanced seed script with proper password hashing
const { MongoClient, ObjectId } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "acu_student_portal"

console.log("🌱 Seeding MongoDB with sample data...")

async function seedDatabase() {
  let client

  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("📡 Connected to MongoDB")

    const db = client.db(DB_NAME)

    // Clear existing data (optional - remove in production)
    console.log("🧹 Clearing existing data...")
    await db.collection("users").deleteMany({})
    await db.collection("courses").deleteMany({})
    await db.collection("file_uploads").deleteMany({})
    await db.collection("attendance").deleteMany({})
    await db.collection("health_chats").deleteMany({})

    // Hash password for all users
    console.log("🔐 Hashing passwords...")
    const hashedPassword = await bcrypt.hash("password123", 12)

    // Seed Users
    console.log("👥 Seeding users...")
    const users = [
      {
        _id: new ObjectId(),
        name: "John Doe",
        email: "student@acu.edu.ng",
        password: hashedPassword,
        matricNumber: "ACU/2023/001",
        department: "Computer Science",
        role: "student",
        fingerprintHash: "hashed_fingerprint_data_001",
        profilePicture: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: "Dr. Sarah Johnson",
        email: "lecturer@acu.edu.ng",
        password: hashedPassword,
        matricNumber: null,
        department: "Computer Science",
        role: "lecturer",
        fingerprintHash: null,
        profilePicture: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        name: "Admin User",
        email: "admin@acu.edu.ng",
        password: hashedPassword,
        matricNumber: null,
        department: "Administration",
        role: "admin",
        fingerprintHash: null,
        profilePicture: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Add more students
    for (let i = 2; i <= 50; i++) {
      const paddedId = i.toString().padStart(3, "0")
      users.push({
        _id: new ObjectId(),
        name: `Student ${i}`,
        email: `student${i}@acu.edu.ng`,
        password: hashedPassword,
        matricNumber: `ACU/2023/${paddedId}`,
        department: ["Computer Science", "Engineering", "Medicine", "Law", "Business Administration"][
          Math.floor(Math.random() * 5)
        ],
        role: "student",
        fingerprintHash: `hashed_fingerprint_data_${paddedId}`,
        profilePicture: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    await db.collection("users").insertMany(users)
    console.log(`✅ Inserted ${users.length} users`)

    // Seed Courses
    console.log("📚 Seeding courses...")
    const lecturerId = users.find((u) => u.role === "lecturer")._id
    const studentIds = users.filter((u) => u.role === "student").map((u) => u._id)

    const courses = [
      {
        _id: new ObjectId(),
        code: "CS301",
        name: "Data Structures & Algorithms",
        department: "Computer Science",
        lecturer: lecturerId,
        semester: "Second",
        year: 2024,
        students: studentIds.slice(0, 30),
        schedule: {
          days: ["Monday", "Wednesday"],
          time: "09:00-11:00",
          room: "Room 204",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId(),
        code: "CS401",
        name: "Software Engineering",
        department: "Computer Science",
        lecturer: lecturerId,
        semester: "Second",
        year: 2024,
        students: studentIds.slice(0, 25),
        schedule: {
          days: ["Tuesday", "Thursday"],
          time: "14:00-16:00",
          room: "Room 301",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("courses").insertMany(courses)
    console.log(`✅ Inserted ${courses.length} courses`)

    // Seed Sample File Uploads
    console.log("📄 Seeding file uploads...")
    const fileUploads = [
      {
        _id: new ObjectId(),
        originalName: "binary_trees.pdf",
        fileName: "uuid-binary-trees.pdf",
        filePath: "/uploads/materials/uuid-binary-trees.pdf",
        fileSize: 2048576,
        mimeType: "application/pdf",
        fileType: "pdf",
        uploadedBy: lecturerId,
        courseCode: "CS301",
        title: "Introduction to Binary Trees",
        description: "Comprehensive guide to binary tree data structures",
        tags: ["trees", "data-structures", "algorithms"],
        category: "material",
        isPublic: true,
        downloads: 145,
        rating: 4.8,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        _id: new ObjectId(),
        originalName: "sorting_algorithms.pdf",
        fileName: "uuid-sorting-algorithms.pdf",
        filePath: "/uploads/materials/uuid-sorting-algorithms.pdf",
        fileSize: 1536000,
        mimeType: "application/pdf",
        fileType: "pdf",
        uploadedBy: lecturerId,
        courseCode: "CS301",
        title: "Advanced Sorting Algorithms",
        description: "Deep dive into sorting algorithm implementations",
        tags: ["sorting", "algorithms", "complexity"],
        category: "material",
        isPublic: true,
        downloads: 89,
        rating: 4.6,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
    ]

    await db.collection("file_uploads").insertMany(fileUploads)
    console.log(`✅ Inserted ${fileUploads.length} file uploads`)

    // Seed Attendance Records
    console.log("📊 Seeding attendance records...")
    const attendanceRecords = []
    const students = users.filter((u) => u.role === "student").slice(0, 30)

    // Generate attendance for the last 30 days
    for (let day = 0; day < 30; day++) {
      const date = new Date()
      date.setDate(date.getDate() - day)
      date.setHours(0, 0, 0, 0)

      students.forEach((student) => {
        // 85% attendance rate simulation
        if (Math.random() > 0.15) {
          attendanceRecords.push({
            _id: new ObjectId(),
            studentId: student._id,
            courseCode: "CS301",
            date: date,
            status: "present",
            timestamp: new Date(date.getTime() + Math.random() * 3600000),
            location: "Room 204",
            fingerprintVerified: true,
            createdAt: new Date(),
          })
        }
      })
    }

    await db.collection("attendance").insertMany(attendanceRecords)
    console.log(`✅ Inserted ${attendanceRecords.length} attendance records`)

    // Seed Health Chats
    console.log("💬 Seeding health chats...")
    const healthChats = [
      {
        _id: new ObjectId(),
        studentId: users[0]._id, // John Doe
        staffId: null,
        messages: [
          {
            id: new ObjectId(),
            sender: "student",
            senderId: users[0]._id,
            content: "I have been feeling unwell lately",
            timestamp: new Date(),
            encrypted: true,
          },
        ],
        status: "active",
        priority: "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await db.collection("health_chats").insertMany(healthChats)
    console.log(`✅ Inserted ${healthChats.length} health chats`)

    console.log("\n🎉 Database seeding completed successfully!")
    console.log("📊 Summary:")
    console.log(`   👥 Users: ${users.length}`)
    console.log(`   📚 Courses: ${courses.length}`)
    console.log(`   📄 File Uploads: ${fileUploads.length}`)
    console.log(`   📊 Attendance Records: ${attendanceRecords.length}`)
    console.log(`   💬 Health Chats: ${healthChats.length}`)
    console.log("\n🔐 Test Accounts:")
    console.log("   Student: student@acu.edu.ng / password123")
    console.log("   Lecturer: lecturer@acu.edu.ng / password123")
    console.log("   Admin: admin@acu.edu.ng / password123")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 MongoDB connection closed")
    }
  }
}

// Run the seeding
seedDatabase().catch(console.error)
