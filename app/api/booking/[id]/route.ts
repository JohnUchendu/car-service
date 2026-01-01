// // app/api/bookings/[id]/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const bookingId = parseInt(params.id)
    
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



// app/api/booking/[id]/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise!
) {
  try {
    // IMPORTANT: Await the params Promise
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
        vehicle: true,
        payment: true 
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