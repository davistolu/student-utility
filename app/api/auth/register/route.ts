import { type NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, matricNumber, department, role } = await request.json()

    // Validation
    if (!name || !email || !password || !department || !role) {
      return NextResponse.json({ success: false, message: "All required fields must be provided" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long" },
        { status: 400 },
      )
    }

    if (role === "student" && !matricNumber) {
      return NextResponse.json({ success: false, message: "Matric number is required for students" }, { status: 400 })
    }

    const result = await registerUser({
      name,
      email,
      password,
      matricNumber,
      department,
      role,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
      message: result.message,
    })

    response.cookies.set("auth-token", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
