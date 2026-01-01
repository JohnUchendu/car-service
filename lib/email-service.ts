// src/lib/email-service.ts
import { resend } from './resend'
import { generateBookingConfirmationEmail, generateAdminNotificationEmail } from './email-templates'

export async function sendBookingConfirmation(booking: any) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log('⚠️ RESEND_API_KEY not set, skipping email')
      return null
    }

    const { subject, html } = generateBookingConfirmationEmail(
      booking,
      booking.payment || { amount: booking.service.price * 0.5, reference: 'N/A' },
      booking.customer
    )

    const data = await resend.emails.send({
      from: 'Auto Detailing <bookings@resend.dev>', // Change to your domain after setup
      to: [booking.customer.email],
      subject,
      html,
      replyTo: 'support@cardetailing.com'
    })

    console.log(`✅ Confirmation email sent to ${booking.customer.email}`)
    return data
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error)
    return null
  }
}

export async function sendAdminNotification(booking: any) {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
      console.log('⚠️ ADMIN_EMAIL not set, skipping admin notification')
      return null
    }

    const { subject, html } = generateAdminNotificationEmail(booking, booking.customer)

    const data = await resend.emails.send({
      from: 'Auto Detailing <notifications@resend.dev>',
      to: [process.env.ADMIN_EMAIL],
      subject,
      html
    })

    console.log(`✅ Admin notification sent for booking #${booking.id}`)
    return data
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error)
    return null
  }
}

// For testing
export async function sendTestEmail(to: string = 'delivered@resend.dev') {
  try {
    const data = await resend.emails.send({
      from: 'Auto Detailing <onboarding@resend.dev>',
      to: [to],
      subject: 'Test Email from Auto Detailing',
      html: '<h1>Email is working! 🎉</h1><p>Your booking system emails are properly configured.</p>'
    })
    console.log('✅ Test email sent successfully')
    return data
  } catch (error) {
    console.error('❌ Test email failed:', error)
    return null
  }
}