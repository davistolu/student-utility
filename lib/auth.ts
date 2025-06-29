import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"
import { getDatabase } from "./mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"
const JWT_EXPIRES_IN = "7d"

export interface User {
  _id: ObjectId
  name: string
  email: string
  password?: string
  matricNumber?: string
  department: string
  role: "student" | "lecturer" | "admin"
  fingerprintHash?: string
  profilePicture?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthResult {
  success: boolean
  user?: Omit<User, "password">
  token?: string
  message?: string
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    const db = await getDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({ email: email.toLowerCase() })

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    if (!user.isActive) {
      return { success: false, message: "Account is deactivated" }
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return { success: false, message: "Invalid email or password" }
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.role)

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user

    return {
      success: true,
      user: userWithoutPassword,
      token,
      message: "Login successful",
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, message: "Authentication failed" }
  }
}

export async function registerUser(userData: {
  name: string
  email: string
  password: string
  matricNumber?: string
  department: string
  role: "student" | "lecturer" | "admin"
}): Promise<AuthResult> {
  try {
    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({
      email: userData.email.toLowerCase(),
    })

    if (existingUser) {
      return { success: false, message: "Email already registered" }
    }

    // Check if matricNumber already exists (for students)
    if (userData.matricNumber) {
      const existingMatric = await db.collection("users").findOne({
        matricNumber: userData.matricNumber,
      })

      if (existingMatric) {
        return { success: false, message: "Matric number already registered" }
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password)

    // Create user object
    const newUser = {
      _id: new ObjectId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      matricNumber: userData.matricNumber || null,
      department: userData.department,
      role: userData.role,
      fingerprintHash: null,
      profilePicture: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert user into database
    await db.collection("users").insertOne(newUser)

    // Generate JWT token
    const token = generateToken(newUser._id.toString(), newUser.role)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser

    return {
      success: true,
      user: userWithoutPassword,
      token,
      message: "Registration successful",
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, message: "Registration failed" }
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const db = await getDatabase()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(userId),
    })
    return user as User | null
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

export async function updateUser(userId: string, updateData: Partial<User>): Promise<boolean> {
  try {
    const db = await getDatabase()

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Update user error:", error)
    return false
  }
}
