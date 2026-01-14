

// // app/api/booking/[id]/route.ts 
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// export async function GET(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> } // params is a Promise!
// ) {
//   try {
//     // IMPORTANT: Await the params Promise
//     const { id } = await params
    
//     const bookingId = parseInt(id)
    
//     if (isNaN(bookingId)) {
//       return NextResponse.json(
//         { error: "Invalid booking ID" },
//         { status: 400 }
//       )
//     }

//     const booking = await prisma.booking.findUnique({
//       where: { id: bookingId },
//       include: {
//         service: true,
//         customer: true,
//         vehicle: true,
//         payment: true 
//       }
//     })

//     if (!booking) {
//       return NextResponse.json(
//         { error: "Booking not found" },
//         { status: 404 }
//       )
//     }

//     return NextResponse.json(booking)
//   } catch (error: any) {
//     console.error("Error fetching booking:", error)
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch booking" },
//       { status: 500 }
//     )
//   }
// }



// app/api/booking/[id]/route.ts 
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Schema for updating booking (admin use)
const updateBookingSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  amountPaid: z.number().optional(),
  paymentDate: z.string().datetime().optional(),
  paymentMethod: z.string().optional(),
  paymentNotes: z.string().optional(),
  notes: z.string().optional()
}).partial()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const bookingId = parseInt(id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: true,
        vehicle: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(booking)
  } catch (error: any) {
    console.error("Error fetching booking:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch booking" },
      { status: 500 }
    )
  }
}

// Add PUT method for admin to update bookings
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookingId = parseInt(id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const validatedData = updateBookingSchema.parse(body)

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Convert paymentDate string to Date object if provided
    if (validatedData.paymentDate) {
      updateData.paymentDate = new Date(validatedData.paymentDate)
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        service: true,
        customer: true,
        vehicle: true
      }
    })

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully",
      booking: updatedBooking
    })

  } catch (error: any) {
    console.error("Error updating booking:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to update booking" },
      { status: 500 }
    )
  }
}

// Add DELETE method for admin to cancel bookings
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookingId = parseInt(id)
    
    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: "Invalid booking ID" },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Soft delete - update status to CANCELLED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }
    })

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully"
    })

  } catch (error: any) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: error.message || "Failed to cancel booking" },
      { status: 500 }
    )
  }
}