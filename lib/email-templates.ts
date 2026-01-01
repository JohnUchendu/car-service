// lib/email-templates.ts
export function generateBookingConfirmationEmail(
  booking: any,
  payment: any,
  customer: any
) {
  const bookingDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return {
    subject: `Booking Confirmed #${booking.id} - Auto Detailing Service`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .success-badge {
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }
    .detail-item {
      background: #f8fafc;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    @media (max-width: 600px) {
      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Booking Confirmed!</h1>
    <p>Thank you for choosing our auto detailing service</p>
  </div>
  
  <div class="content">
    <div class="success-badge">CONFIRMED</div>
    
    <div class="card">
      <h2>Booking Summary</h2>
      <div class="details-grid">
        <div class="detail-item">
          <strong>Booking ID</strong>
          <p>#${booking.id}</p>
        </div>
        <div class="detail-item">
          <strong>Service</strong>
          <p>${booking.service.name}</p>
        </div>
        <div class="detail-item">
          <strong>Date & Time</strong>
          <p>${bookingDate}<br>${booking.timeSlot}</p>
        </div>
        <div class="detail-item">
          <strong>Vehicle</strong>
          <p>${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}</p>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h2>Payment Details</h2>
      <p><strong>Deposit Paid:</strong> ₦${payment.amount?.toLocaleString() || '0.00'}</p>
      <p><strong>Payment Status:</strong> <span style="color: #10b981;">✓ Successful</span></p>
      <p><strong>Reference:</strong> ${payment.reference}</p>
    </div>
    
    <div class="card">
      <h2>Important Information</h2>
      <ul>
        <li>Please arrive <strong>10 minutes</strong> before your scheduled time</li>
        <li>Bring a valid ID for verification</li>
        <li>Remove all personal belongings from your vehicle</li>
        <li>Service duration is approximate and may vary slightly</li>
        ${booking.pickupDropoff ? 
          '<li>Our driver will contact you 30 minutes before pickup</li>' : 
          '<li>Park in our designated customer parking area</li>'
        }
      </ul>
    </div>
    
    <div style="text-align: center;">
      <a href="https://maps.google.com/?q=Auto+Detailing+Location" class="button">
        📍 Get Directions
      </a>
    </div>
    
    <div class="footer">
      <p>Need to reschedule or have questions?</p>
      <p>📞 Call: 0800-123-4567 | ✉️ Email: support@cardetailing.com</p>
      <p>Business Hours: Mon-Sat 8:00 AM - 6:00 PM</p>
      <p style="font-size: 12px; margin-top: 20px;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
    `
  }
}

export function generateAdminNotificationEmail(booking: any, customer: any) {
  return {
    subject: `📋 New Booking #${booking.id} - ${customer.name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
    .info { background: #f8fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #3b82f6; }
    .label { font-weight: bold; color: #4b5563; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Booking Received</h1>
    </div>
    
    <div class="info">
      <p><span class="label">Booking ID:</span> #${booking.id}</p>
      <p><span class="label">Customer:</span> ${customer.name}</p>
      <p><span class="label">Service:</span> ${booking.service?.name || 'N/A'}</p>
      <p><span class="label">Date:</span> ${new Date(booking.date).toLocaleDateString()}</p>
      <p><span class="label">Time:</span> ${booking.timeSlot}</p>
      <p><span class="label">Vehicle:</span> ${booking.vehicle?.make} ${booking.vehicle?.model} (${booking.vehicle?.plate})</p>
      <p><span class="label">Phone:</span> ${customer.phone}</p>
      <p><span class="label">Email:</span> ${customer.email}</p>
      ${booking.pickupDropoff ? '<p><span class="label">⚠️ Pickup & Drop-off Required</span></p>' : ''}
    </div>
    
    <p>
      <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/portal/bookings/${booking.id}" 
         style="background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View Booking Details
      </a>
    </p>
  </div>
</body>
</html>
    `
  }
}