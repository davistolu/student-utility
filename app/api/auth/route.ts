import { type NextRequest, NextResponse } from "next/server"

// Simulated user database
const users = [
  {
    id: "1",
    email: "student@acu.edu.ng",
    name: "John Doe",
    role: "student",
    matricNumber: "ACU/2023/001",
    department: "Computer Science",
  },
  {
    id: "2",
    email: "lecturer@acu.edu.ng",
    name: "Dr. Sarah Johnson",
    role: "lecturer",
    department: "Computer Science",
  },
  {
    id: "3",
    email: "admin@acu.edu.ng",
    name: "Admin User",
    role: "admin",
    department: "Administration",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    if (action === "login") {
      // Simulate login validation
      const user = users.find((u) => u.email === email)

      if (user) {
        // In a real app, you'd verify the password hash
        const token = `jwt_token_${user.id}_${Date.now()}`

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            matricNumber: user.matricNumber,
            department: user.department,
          },
          token,
        })
      } else {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }
    }

    if (action === "register") {
      // Check if user already exists
      const existingUser = users.find((u) => u.email === email)
      if (existingUser) {
        return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 })
      }

      // Simulate user registration
      const newUser = {
        id: (users.length + 1).toString(),
        email,
        name: "New User",
        role: "student",
        matricNumber: `ACU/2024/${(users.length + 1).toString().padStart(3, "0")}`,
        department: "Computer Science",
      }

      users.push(newUser)

      return NextResponse.json({
        success: true,
        message: "User registered successfully",
        user: newUser,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
