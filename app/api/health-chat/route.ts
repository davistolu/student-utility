import { NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const GET = withAuth(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get("chatId")

    const db = await getDatabase()

    if (chatId) {
      const chat = await db.collection("health_chats").findOne({
        _id: new ObjectId(chatId),
      })

      if (!chat) {
        return NextResponse.json({ success: false, message: "Chat not found" }, { status: 404 })
      }

      // Check if user has access to this chat
      if (req.user!.role === "student" && chat.studentId.toString() !== req.user!.userId) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
      }

      return NextResponse.json({
        success: true,
        data: chat,
      })
    }

    // Get all chats for the user
    const query: any = {}
    if (req.user!.role === "student") {
      query.studentId = new ObjectId(req.user!.userId)
    }

    const chats = await db.collection("health_chats").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      data: chats,
    })
  } catch (error) {
    console.error("Get health chat API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
})

export const POST = withAuth(async (req) => {
  try {
    const { action, chatId, message, priority } = await req.json()

    const db = await getDatabase()

    if (action === "create_chat") {
      // Create new chat
      const newChat = {
        _id: new ObjectId(),
        studentId: new ObjectId(req.user!.userId),
        staffId: null,
        messages: [],
        status: "active",
        priority: priority || "normal",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await db.collection("health_chats").insertOne(newChat)

      return NextResponse.json({
        success: true,
        message: "Chat created successfully",
        data: newChat,
      })
    }

    if (action === "send_message") {
      if (!chatId || !message) {
        return NextResponse.json({ success: false, message: "Chat ID and message are required" }, { status: 400 })
      }

      const chat = await db.collection("health_chats").findOne({
        _id: new ObjectId(chatId),
      })

      if (!chat) {
        return NextResponse.json({ success: false, message: "Chat not found" }, { status: 404 })
      }

      // Check access
      if (req.user!.role === "student" && chat.studentId.toString() !== req.user!.userId) {
        return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
      }

      const newMessage = {
        id: new ObjectId(),
        sender: req.user!.role === "student" ? "student" : "staff",
        senderId: new ObjectId(req.user!.userId),
        content: message,
        timestamp: new Date(),
        encrypted: true,
      }

      await db.collection("health_chats").updateOne(
        { _id: new ObjectId(chatId) },
        {
          $push: { messages: newMessage },
          $set: { updatedAt: new Date() },
        },
      )

      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Health chat API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
})
