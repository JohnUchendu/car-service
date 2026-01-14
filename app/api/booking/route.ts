// //app/api/booking/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { z } from "zod"

// // Validation schema
// const bookingSchema = z.object({
//   serviceId: z.number(),
//   date: z.string().datetime(),
//   timeSlot: z.string(),
//   pickupDropoff: z.boolean().default(false),
//   depositAmount: z.number(),
//   customer: z.object({
//     name: z.string().min(2),
//     email: z.string().email(),
//     phone: z.string().min(10)
//   }),
//   vehicle: z.object({
//     make: z.string().min(2),
//     model: z.string().min(2),
//     year: z.number().min(1900).max(new Date().getFullYear() + 1),
//     plate: z.string().min(3),
//     color: z.string().optional()
//   })
// })

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()
    
//     // Validate input
//     const validatedData = bookingSchema.parse(body)
//     const { serviceId, date, timeSlot, pickupDropoff, depositAmount, customer, vehicle } = validatedData

//     // Check if service exists and is active
//     const service = await prisma.service.findFirst({
//       where: { id: serviceId, active: true }
//     })

//     if (!service) {
//       return NextResponse.json(
//         { error: "Service not found or inactive" },
//         { status: 400 }
//       )
//     }

//     // 1. Create or find customer
//     const dbCustomer = await prisma.customer.upsert({
//       where: { email: customer.email },
//       update: {
//         name: customer.name,
//         phone: customer.phone
//       },
//       create: {
//         name: customer.name,
//         email: customer.email,
//         phone: customer.phone
//       }
//     })

//     // 2. Create or find vehicle
//     const dbVehicle = await prisma.vehicle.upsert({
//       where: { plate: vehicle.plate },
//       update: {
//         make: vehicle.make,
//         model: vehicle.model,
//         year: vehicle.year,
//         color: vehicle.color,
//         customerId: dbCustomer.id
//       },
//       create: {
//         make: vehicle.make,
//         model: vehicle.model,
//         year: vehicle.year,
//         plate: vehicle.plate,
//         color: vehicle.color,
//         customerId: dbCustomer.id
//       }
//     })

//     // 3. Create booking
//     const booking = await prisma.booking.create({
//       data: {
//         customerId: dbCustomer.id,
//         vehicleId: dbVehicle.id,
//         serviceId: service.id,
//         date: new Date(date),
//         timeSlot: timeSlot,
//         pickupDropoff: pickupDropoff,
//         status: "PENDING",
//         createdAt: new Date()
//       },
//       include: {
//         service: true,
//         customer: true,
//         vehicle: true
//       }
//     })

//     // 4. Initialize Paystack payment
//     const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
//     if (!PAYSTACK_SECRET_KEY) {
//       throw new Error("Paystack secret key not configured")
//     }

//     const response = await fetch("https://api.paystack.co/transaction/initialize", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         email: customer.email,
//         amount: Math.round(depositAmount * 100), // Convert to kobo
//         reference: `booking_${booking.id}_${Date.now()}`,
//         callback_url: `${process.env.NEXT_PUBLIC_URL || 'http://refinishphc.com'}/booking/success`,
//         metadata: {
//           booking_id: booking.id,
//           customer_id: dbCustomer.id,
//           service_name: service.name
//         }
//       })
//     })

//     const paystackData = await response.json()

//     if (!paystackData.status) {
//       console.error("Paystack error:", paystackData.message)
//       return NextResponse.json(
//         { error: `Payment initialization failed: ${paystackData.message}` },
//         { status: 400 }
//       )
//     }

//     // 5. Save payment record
//     await prisma.payment.create({
//       data: {
//         bookingId: booking.id,
//         amount: depositAmount,
//         reference: paystackData.data.reference,
//         status: "PENDING",
//         metadata: paystackData.data
//       }
//     })

//     // Return success response
//     return NextResponse.json({
//       success: true,
//       message: "Booking created successfully",
//       authorization_url: paystackData.data.authorization_url,
//       booking_id: booking.id,
//       reference: paystackData.data.reference
//     })

//   } catch (error: any) {
//     console.error("Booking API error:", error)
    
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: "Validation failed", details: error.errors },
//         { status: 400 }
//       )
//     }
    
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

// // OPTIONAL: Add GET to fetch available time slots
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const date = searchParams.get('date')
    
//     if (!date) {
//       return NextResponse.json(
//         { error: "Date parameter is required" },
//         { status: 400 }
//       )
//     }

//     const selectedDate = new Date(date)
//     const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0))
//     const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999))

//     // Get all bookings for this date
//     const bookings = await prisma.booking.findMany({
//       where: {
//         date: {
//           gte: startOfDay,
//           lt: endOfDay
//         },
//         status: {
//           in: ["PENDING", "CONFIRMED"]
//         }
//       },
//       select: {
//         timeSlot: true,
//         service: {
//           select: {
//             duration: true
//           }
//         }
//       }
//     })

//     // Generate available time slots (9 AM to 5 PM)
//     const availableSlots = []
//     for (let hour = 9; hour <= 17; hour++) {
//       const time = `${hour.toString().padStart(2, '0')}:00`
//       availableSlots.push(time)
//     }

//     return NextResponse.json({
//       date,
//       availableSlots,
//       bookedSlots: bookings.map((b: any) => b.timeSlot)
//     })

//   } catch (error) {
//     console.error("Error fetching availability:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch availability" },
//       { status: 500 }
//     )
//   }
// }





// app/api/booking/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email-service'

// Validation schema - removed depositAmount
const bookingSchema = z.object({
  serviceId: z.number(),
  date: z.string().datetime(),
  timeSlot: z.string(),
  pickupDropoff: z.boolean().default(false),
  notes: z.string().optional(), // Added notes field
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10)
  }),
  vehicle: z.object({
    make: z.string().min(2),
    model: z.string().min(2),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    plate: z.string().min(3),
    color: z.string().optional()
  })
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = bookingSchema.parse(body)
    const { serviceId, date, timeSlot, pickupDropoff, notes, customer, vehicle } = validatedData

    // Check if service exists and is active
    const service = await prisma.service.findFirst({
      where: { id: serviceId, active: true }
    })

    if (!service) {
      return NextResponse.json(
        { error: "Service not found or inactive" },
        { status: 400 }
      )
    }

    // Check if time slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        },
        timeSlot: timeSlot,
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose another time." },
        { status: 400 }
      )
    }

    // 1. Create or find customer
    const dbCustomer = await prisma.customer.upsert({
      where: { email: customer.email },
      update: {
        name: customer.name,
        phone: customer.phone
      },
      create: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    })

    // 2. Create or find vehicle
    const dbVehicle = await prisma.vehicle.upsert({
      where: { plate: vehicle.plate },
      update: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        customerId: dbCustomer.id
      },
      create: {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        color: vehicle.color,
        customerId: dbCustomer.id
      }
    })

    // 3. Create booking without payment
    const booking = await prisma.booking.create({
      data: {
        customerId: dbCustomer.id,
        vehicleId: dbVehicle.id,
        serviceId: service.id,
        date: new Date(date),
        timeSlot: timeSlot,
        pickupDropoff: pickupDropoff,
        notes: notes,
        status: "PENDING", // Changed to PENDING since no payment required
        createdAt: new Date()
      },
      include: {
        service: true,
        customer: true,
        vehicle: true
      }
    })

    // 4. Send confirmation email
    try {
      await sendBookingConfirmation(booking)
      console.log("📧 Booking confirmation email sent to customer")

      // Notify admin about new booking
      await sendAdminNotification(booking)
      console.log("📧 Admin notification sent")

    } catch (emailError) {
      console.error("⚠️ Email sending failed:", emailError)
      // Continue even if email fails
    }

    // Return success response - no payment URL needed
    return NextResponse.json({
      success: true,
      message: "Booking created successfully",
      booking_id: booking.id,
      booking: booking
    })

  } catch (error: any) {
    console.error("Booking API error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// OPTIONAL: Add GET to fetch available time slots
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      )
    }

    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0))
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999))

    // Get all bookings for this date
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      },
      select: {
        timeSlot: true,
        service: {
          select: {
            duration: true
          }
        }
      }
    })

    // Generate available time slots (9 AM to 5 PM)
    const availableSlots = []
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      availableSlots.push(time)
    }

    return NextResponse.json({
      date,
      availableSlots,
      bookedSlots: bookings.map((b: any) => b.timeSlot)
    })

  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    )
  }
}