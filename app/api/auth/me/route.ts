import { NextResponse } from "next/server"
import { withAuth } from "@/lib/middleware"
import { getUserById } from "@/lib/auth"

export const GET = withAuth(async (req) => {
  try {
    const user = await getUserById(req.user!.userId)

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const { password, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Get user API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
})
