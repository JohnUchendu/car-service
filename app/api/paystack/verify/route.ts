// // app/api/paystack/verify/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const reference = searchParams.get('reference')
    
//     if (!reference) {
//       return NextResponse.json(
//         { error: "Reference is required" },
//         { status: 400 }
//       )
//     }

//     // Verify with Paystack
//     const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//       }
//     })

//     const verifyData = await verifyRes.json()

//     if (verifyData.status && verifyData.data.status === "success") {
  
//       await prisma.payment.update({
//         where: { reference },
//         data: { 
//           status: "SUCCESS", 
//           metadata: verifyData.data,
//           updatedAt: new Date()
//         }
//       })

//       // Get payment with booking
//       const payment = await prisma.payment.findUnique({
//         where: { reference },
//         include: { booking: true }
//       })

//       if (payment) {
//         // Update booking to CONFIRMED (UPPERCASE)
//         await prisma.booking.update({
//           where: { id: payment.bookingId },
//           data: { 
//             depositPaid: true,
//             status: "CONFIRMED", // Changed to uppercase
//             updatedAt: new Date()
//           }
//         })

//         return NextResponse.json({
//           success: true,
//           message: "Payment verified and booking confirmed",
//           bookingId: payment.bookingId,
//           reference: reference
//         })
//       }
//     }

//     return NextResponse.json({
//       success: false,
//       message: "Payment verification failed",
//       data: verifyData
//     })

//   } catch (error: any) {
//     console.error("Verification error:", error)
//     return NextResponse.json(
//       { error: error.message || "Verification failed" },
//       { status: 500 }
//     )
//   }
// }




// app/api/paystack/verify/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"




export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const reference = searchParams.get('reference')
    
    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      )
    }

    console.log("🔍 Verifying Paystack reference:", reference)

    // Verify with Paystack
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    })

    const verifyData = await verifyRes.json()
    console.log("🔍 Paystack response:", JSON.stringify(verifyData, null, 2))

    // IMPORTANT: Paystack returns lowercase "success", not "SUCCESS"
    if (verifyData.status && verifyData.data && verifyData.data.status === "success") {
      console.log("✅ Payment verified successfully by Paystack")
      
      // Update payment status to SUCCESS (UPPERCASE for our database)
      await prisma.payment.update({
        where: { reference },
        data: { 
          status: "SUCCESS", // UPPERCASE for our enum
          metadata: verifyData.data,
          updatedAt: new Date()
        }
      })

      console.log("✅ Payment updated in database")

      // Get the booking via payment
      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: { booking: true }
      })

      if (payment && payment.booking) {
        // Update booking to CONFIRMED
        await prisma.booking.update({
          where: { id: payment.booking.id },
          data: { 
            depositPaid: true,
            status: "CONFIRMED",
            updatedAt: new Date()
          }
        })

        console.log("✅ Booking updated:", payment.booking.id)

        return NextResponse.json({
          success: true,
          message: "Payment verified and booking confirmed",
          bookingId: payment.booking.id,
          reference: reference
        })
      } else {
        console.log("❌ Payment found but no booking associated")
      }
    } else {
      console.log("❌ Paystack verification failed. Status:", verifyData.data?.status)
      console.log("❌ Message:", verifyData.message)
    }

    return NextResponse.json({
      success: false,
      message: `Payment verification failed: ${verifyData.message || 'Transaction not successful'}`,
      data: verifyData
    })

  } catch (error: any) {
    console.error("❌ Verification error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "Verification failed" 
      },
      { status: 500 }
    )
  }
}