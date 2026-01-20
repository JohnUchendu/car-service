// app/api/db-test/route.ts
import { NextResponse } from "next/server"
import { prisma, testConnection } from "@/lib/prisma"

export async function GET() {
  try {
    const connectionOk = await testConnection()
    
    if (!connectionOk) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as time`
    
    return NextResponse.json({
      success: true,
      connection: "OK",
      time: result
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Database error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}