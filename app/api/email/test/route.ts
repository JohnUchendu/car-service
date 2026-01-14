// app/api/email/test/route.ts
import { NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/email-service"

export async function GET() {
  try {
    const result = await sendTestEmail()
    
    if (result) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        data: result
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to send test email"
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Test email error:", error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}