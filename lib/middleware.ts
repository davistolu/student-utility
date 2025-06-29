import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "./auth"

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    role: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get("authorization")

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const decoded = verifyToken(token)

      if (!decoded) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
      }

      req.user = decoded
      return await handler(req)
    } catch (error) {
      console.error("Auth middleware error:", error)
      return NextResponse.json({ success: false, message: "Authentication failed" }, { status: 401 })
    }
  }
}

export function requireRole(roles: string[]) {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return NextResponse.json({ success: false, message: "Insufficient permissions" }, { status: 403 })
      }
      return await handler(req)
    })
  }
}
