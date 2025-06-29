// MongoDB Setup Script for ACU Student Utility Portal
// This script sets up MongoDB connection and creates collections with proper indexes

const { MongoClient } = require("mongodb")

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "acu_student_portal"

console.log("🚀 Setting up MongoDB for ACU Student Utility Portal...")

async function setupMongoDB() {
  let client

  try {
    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("✅ Connected to MongoDB successfully!")

    const db = client.db(DB_NAME)

    // Define collections
    const collections = [
      "users",
      "attendance",
      "courses",
      "materials",
      "health_chats",
      "campus_locations",
      "past_questions",
      "ai_generated_questions",
      "file_uploads",
    ]

    // Create collections if they don't exist
    console.log("\n📁 Creating collections...")
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`✅ Created collection: ${collectionName}`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`ℹ️  Collection ${collectionName} already exists`)
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message)
        }
      }
    }

    // Create indexes for better performance
    console.log("\n🔍 Creating indexes...")

    // Users collection indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ matricNumber: 1 }, { unique: true, sparse: true })
    await db.collection("users").createIndex({ role: 1 })
    console.log("✅ Created indexes for users collection")

    // Attendance collection indexes
    await db.collection("attendance").createIndex({ studentId: 1, date: -1 })
    await db.collection("attendance").createIndex({ courseCode: 1, date: -1 })
    await db.collection("attendance").createIndex({ date: -1 })
    console.log("✅ Created indexes for attendance collection")

    // Courses collection indexes
    await db.collection("courses").createIndex({ code: 1 }, { unique: true })
    await db.collection("courses").createIndex({ lecturer: 1 })
    await db.collection("courses").createIndex({ department: 1 })
    console.log("✅ Created indexes for courses collection")

    // Materials collection indexes
    await db.collection("materials").createIndex({ courseCode: 1 })
    await db.collection("materials").createIndex({ uploadDate: -1 })
    await db.collection("materials").createIndex({ rating: -1 })
    await db.collection("materials").createIndex({ title: "text", description: "text" })
    console.log("✅ Created indexes for materials collection")

    // Health chats collection indexes
    await db.collection("health_chats").createIndex({ studentId: 1 })
    await db.collection("health_chats").createIndex({ status: 1 })
    await db.collection("health_chats").createIndex({ createdAt: -1 })
    console.log("✅ Created indexes for health_chats collection")

    // File uploads collection indexes
    await db.collection("file_uploads").createIndex({ uploadedBy: 1 })
    await db.collection("file_uploads").createIndex({ uploadDate: -1 })
    await db.collection("file_uploads").createIndex({ fileType: 1 })
    await db.collection("file_uploads").createIndex({ courseCode: 1 })
    console.log("✅ Created indexes for file_uploads collection")

    console.log("\n🎉 MongoDB setup completed successfully!")
    console.log(`📊 Database: ${DB_NAME}`)
    console.log(`📁 Collections: ${collections.length}`)
    console.log("🔍 Indexes: Created for optimal performance")
  } catch (error) {
    console.error("❌ MongoDB setup failed:", error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log("🔌 MongoDB connection closed")
    }
  }
}

// Run the setup
setupMongoDB().catch(console.error)
