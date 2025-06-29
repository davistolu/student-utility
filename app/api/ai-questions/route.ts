import { type NextRequest, NextResponse } from "next/server"

// Simulated AI-generated questions database
const aiQuestions = [
  {
    id: "ai_q_001",
    courseCode: "CS301",
    question: "Explain the time complexity of merge sort and provide a detailed analysis.",
    difficulty: "Medium",
    confidence: 92,
    basedOn: "Past 5 exams + Lecture patterns",
    generatedAt: new Date().toISOString(),
  },
  {
    id: "ai_q_002",
    courseCode: "CS401",
    question: "Compare and contrast Agile and Waterfall methodologies in software development.",
    difficulty: "Hard",
    confidence: 88,
    basedOn: "Lecturer emphasis + Past questions",
    generatedAt: new Date().toISOString(),
  },
  {
    id: "ai_q_003",
    courseCode: "CS302",
    question: "Design a database schema for a university management system.",
    difficulty: "Hard",
    confidence: 85,
    basedOn: "Assignment patterns + Exam trends",
    generatedAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const courseCode = searchParams.get("course")
  const difficulty = searchParams.get("difficulty")

  let filteredQuestions = aiQuestions

  if (courseCode) {
    filteredQuestions = filteredQuestions.filter((q) => q.courseCode === courseCode)
  }

  if (difficulty) {
    filteredQuestions = filteredQuestions.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase())
  }

  return NextResponse.json({
    success: true,
    data: filteredQuestions,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { courseCode, count = 2, difficulty } = await request.json()

    if (!courseCode) {
      return NextResponse.json({ success: false, message: "Course code is required" }, { status: 400 })
    }

    // Simulate AI question generation
    const questionTemplates = {
      CS301: [
        "Implement a {difficulty} algorithm to solve the {problem} problem and analyze its time complexity.",
        "Compare and contrast {dataStructure1} and {dataStructure2} with respect to their operations and efficiency.",
        "Explain how {algorithm} works and provide a step-by-step execution trace for the input {input}.",
        "Design an efficient algorithm to {task} and prove its correctness.",
      ],
      CS401: [
        "Discuss the advantages and disadvantages of {methodology1} compared to {methodology2} in software development.",
        "Explain how {pattern} design pattern can be applied to solve {problem}.",
        "Describe the key components of {process} and how they contribute to software quality.",
        "Analyze the requirements for {system} and design an appropriate architecture.",
      ],
      CS302: [
        "Design a normalized database schema for {system} and explain your design choices.",
        "Write SQL queries to {task} for the given database schema.",
        "Compare {dbType1} and {dbType2} databases in terms of {criteria}.",
        "Explain how {concept} is implemented in modern database systems.",
      ],
    }

    const dataStructures = ["binary trees", "AVL trees", "hash tables", "linked lists", "heaps"]
    const algorithms = ["quicksort", "merge sort", "Dijkstra's algorithm", "dynamic programming"]
    const methodologies = ["Agile", "Waterfall", "DevOps", "Scrum", "Kanban"]
    const patterns = ["Singleton", "Factory", "Observer", "Strategy", "MVC"]
    const dbTypes = ["relational", "NoSQL", "document-oriented", "graph", "key-value"]

    // Generate new questions
    const newQuestions = []
    const templates = questionTemplates[courseCode] || questionTemplates.CS301

    for (let i = 0; i < count; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)]
      let question = template

      // Replace placeholders with random values
      question = question.replace(
        "{difficulty}",
        difficulty || ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      )
      question = question.replace(
        "{problem}",
        ["sorting", "searching", "optimization", "path finding"][Math.floor(Math.random() * 4)],
      )
      question = question.replace("{dataStructure1}", dataStructures[Math.floor(Math.random() * dataStructures.length)])
      question = question.replace("{dataStructure2}", dataStructures[Math.floor(Math.random() * dataStructures.length)])
      question = question.replace("{algorithm}", algorithms[Math.floor(Math.random() * algorithms.length)])
      question = question.replace("{input}", "[5, 2, 9, 1, 7, 6, 3]")
      question = question.replace("{methodology1}", methodologies[Math.floor(Math.random() * methodologies.length)])
      question = question.replace("{methodology2}", methodologies[Math.floor(Math.random() * methodologies.length)])
      question = question.replace("{pattern}", patterns[Math.floor(Math.random() * patterns.length)])
      question = question.replace(
        "{process}",
        ["testing", "requirements gathering", "design", "implementation"][Math.floor(Math.random() * 4)],
      )
      question = question.replace(
        "{system}",
        ["e-commerce", "university management", "healthcare", "banking"][Math.floor(Math.random() * 4)],
      )
      question = question.replace(
        "{task}",
        ["retrieve user data", "calculate statistics", "join related tables"][Math.floor(Math.random() * 3)],
      )
      question = question.replace("{dbType1}", dbTypes[Math.floor(Math.random() * dbTypes.length)])
      question = question.replace("{dbType2}", dbTypes[Math.floor(Math.random() * dbTypes.length)])
      question = question.replace(
        "{criteria}",
        ["performance", "scalability", "data integrity", "flexibility"][Math.floor(Math.random() * 4)],
      )
      question = question.replace(
        "{concept}",
        ["indexing", "transactions", "normalization", "sharding"][Math.floor(Math.random() * 4)],
      )

      const newQuestion = {
        id: `ai_q_${Date.now()}_${i}`,
        courseCode,
        question,
        difficulty: difficulty || ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
        confidence: Math.floor(Math.random() * 15) + 80, // 80-95%
        basedOn: ["Past exams", "Lecture patterns", "Textbook emphasis", "Assignment trends"][
          Math.floor(Math.random() * 4)
        ],
        generatedAt: new Date().toISOString(),
      }

      newQuestions.push(newQuestion)
      aiQuestions.push(newQuestion)
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${count} questions for ${courseCode}`,
      data: newQuestions,
    })
  } catch (error) {
    console.error("AI questions API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
