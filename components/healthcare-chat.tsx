"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Send, Heart, Clock, Shield, User, Phone, AlertTriangle } from "lucide-react"

interface HealthcareChatProps {
  userRole: "student" | "health-staff" | "admin"
}

interface Message {
  id: number
  sender: "user" | "staff" | "system"
  content: string
  timestamp: string
  urgent?: boolean
}

export default function HealthcareChat({ userRole }: HealthcareChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "system",
      content: "Welcome to ACU Health Center. Your conversation is private and secure. How can we help you today?",
      timestamp: "09:00 AM",
    },
    {
      id: 2,
      sender: "staff",
      content:
        "Hello! I'm Nurse Sarah. I'm here to help with any health concerns you may have. Please feel free to share what's bothering you.",
      timestamp: "09:01 AM",
    },
  ])

  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [chatStatus, setChatStatus] = useState<"active" | "waiting" | "closed" | "urgent">("active")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // Load chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]")
    if (chatHistory.length > 0) {
      setMessages((prev) => [...prev, ...chatHistory])
    }

    scrollToBottom()
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Store the message in localStorage to persist chat history
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]")
    chatHistory.push(userMessage)
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory))

    // Simulate staff response based on message content
    setTimeout(() => {
      let responseContent = ""
      const lowerCaseMessage = newMessage.toLowerCase()

      if (lowerCaseMessage.includes("headache") || lowerCaseMessage.includes("pain")) {
        responseContent =
          "I'm sorry to hear you're experiencing pain. How long have you been feeling this way? Have you taken any medication?"
      } else if (lowerCaseMessage.includes("appointment") || lowerCaseMessage.includes("book")) {
        responseContent =
          "I'd be happy to help you schedule an appointment. Are you available tomorrow between 9 AM and 2 PM?"
      } else if (lowerCaseMessage.includes("emergency")) {
        responseContent =
          "If this is a medical emergency, please call our emergency line at 911 immediately or visit the emergency room."
      } else {
        const responses = [
          "Thank you for sharing that with me. Can you tell me more about when this started?",
          "I understand your concern. Have you experienced this before?",
          "That sounds concerning. Let me ask you a few more questions to better understand your situation.",
          "Based on what you've told me, I'd recommend scheduling an appointment. Would you like me to help you with that?",
          "I appreciate you reaching out. Your health and wellbeing are important to us.",
        ]
        responseContent = responses[Math.floor(Math.random() * responses.length)]
      }

      const staffResponse: Message = {
        id: Date.now() + 1,
        sender: "staff",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, staffResponse])
      setIsTyping(false)

      // Store the response in localStorage
      const updatedChatHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]")
      updatedChatHistory.push(staffResponse)
      localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory))

      // If it's an emergency message, change chat status
      if (lowerCaseMessage.includes("emergency")) {
        setChatStatus("urgent")
      }
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleEmergency = () => {
    const emergencyMessage: Message = {
      id: Date.now(),
      sender: "system",
      content:
        "EMERGENCY ALERT: A staff member has been notified and will contact you immediately. If this is a life-threatening emergency, please call 911.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      urgent: true,
    }

    setMessages((prev) => [...prev, emergencyMessage])
    setChatStatus("urgent")

    // Simulate emergency response
    setTimeout(() => {
      const staffResponse: Message = {
        id: Date.now() + 1,
        sender: "staff",
        content:
          "I see you've triggered an emergency alert. I'm here to help. Please describe your emergency situation, and I'll provide immediate assistance.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        urgent: true,
      }

      setMessages((prev) => [...prev, staffResponse])
      setIsTyping(false)
    }, 1000)
  }

  if (userRole === "student") {
    return (
      <div className="space-y-6">
        {/* Chat Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <span>Health Center Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                  Online
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmergency}
                  className="bg-red-50 text-red-600 hover:bg-red-100"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency: 911
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Secure, confidential chat with health center staff</CardDescription>
          </CardHeader>
        </Card>

        {/* Privacy Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Privacy & Security</h3>
                <p className="text-sm text-blue-700 mt-1">
                  This chat is encrypted and confidential. Only authorized health center staff can access your messages.
                  For emergencies, please call 911 or visit the emergency room.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Chat with Health Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : message.sender === "staff"
                            ? "bg-white border"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {message.sender === "staff" && (
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3" />
                          <span className="text-xs font-medium">Health Staff</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span className="text-xs font-medium">Health Staff</span>
                      </div>
                      <div className="flex space-x-1 mt-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Type your message here... (Press Enter to send)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 min-h-[60px] max-h-32"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Health Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Health Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Book Appointment</span>
                </div>
                <p className="text-sm text-gray-600">Schedule a visit with our medical staff</p>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-red-600" />
                  <span className="font-medium">Mental Health</span>
                </div>
                <p className="text-sm text-gray-600">Counseling and mental health support</p>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">Health Tips</span>
                </div>
                <p className="text-sm text-gray-600">Daily health and wellness advice</p>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Emergency Contacts</span>
                </div>
                <p className="text-sm text-gray-600">Important emergency numbers</p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Health Staff View (simplified for demo)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Staff Dashboard</CardTitle>
          <CardDescription>Manage student health consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-600">Active Chats</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">45</div>
              <p className="text-sm text-gray-600">Resolved Today</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-sm text-gray-600">Urgent Cases</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
