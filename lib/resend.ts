// src/lib/resend.ts
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Test email sending
export async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'Auto Detailing <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Test Email',
      html: '<strong>It works!</strong>',
    })
    console.log('✅ Email test successful:', data)
    return data
  } catch (error) {
    console.error('❌ Email test failed:', error)
    return null
  }
}