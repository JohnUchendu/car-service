// // app/(public)/booking/success/page.tsx
// "use client"

// import { useEffect, useState } from 'react'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { CheckCircle, Calendar, Car, Mail, Phone, Loader2, AlertCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"

// type BookingDetails = {
//   id: number
//   date: string
//   timeSlot: string
//   pickupDropoff: boolean
//   status: string
//   depositPaid: boolean
//   service: {
//     name: string
//     price: number
//   }
//   vehicle: {
//     make: string
//     model: string
//     year: number
//     plate: string
//     color: string | null
//   }
//   customer: {
//     name: string
//     email: string
//     phone: string
//   }
// }

// export default function BookingSuccessPage() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const reference = searchParams.get('reference')
//   const status = searchParams.get('status')
  
//   const [loading, setLoading] = useState(true)
//   const [verifying, setVerifying] = useState(true)
//   const [booking, setBooking] = useState<BookingDetails | null>(null)
//   const [error, setError] = useState<string | null>(null)

// // In your success page useEffect, add logging:
// useEffect(() => {
//   const verifyAndFetch = async () => {
//     if (!reference) {
//       setError("No payment reference found")
//       setLoading(false)
//       setVerifying(false)
//       return
//     }

//     console.log("🔍 Starting verification for reference:", reference)

//     try {
//       // Step 1: Verify payment with Paystack
//       const verifyRes = await fetch(`/api/paystack/verify?reference=${reference}`)
//       const verifyData = await verifyRes.json()
      
//       console.log("🔍 Verify API response:", verifyData)
      
//       if (!verifyData.success) {
//         console.log("❌ Verification failed:", verifyData.message)
//         setError(`Payment verification failed: ${verifyData.message}`)
//         setVerifying(false)
//         setLoading(false)
//         return
//       }

//       console.log("✅ Verification successful, bookingId:", verifyData.bookingId)
//       setVerifying(false)
      
//       // Step 2: Fetch booking details
//       const bookingRes = await fetch(`/api/booking/${verifyData.bookingId}`)
//       console.log("🔍 Booking fetch response status:", bookingRes.status)
      
//       if (bookingRes.ok) {
//         const bookingData = await bookingRes.json()
//         console.log("✅ Booking data loaded:", bookingData)
//         setBooking(bookingData)
//       } else {
//         const errorText = await bookingRes.text()
//         console.log("❌ Booking fetch failed:", errorText)
//         setError("Failed to load booking details")
//       }
      
//     } catch (err: any) {
//       console.error("❌ Error in verifyAndFetch:", err)
//       setError(err.message || "An error occurred")
//     } finally {
//       setLoading(false)
//     }
//   }

//   verifyAndFetch()
// }, [reference])


//   useEffect(() => {
//     const verifyAndFetch = async () => {
//       if (!reference) {
//         setError("No payment reference found")
//         setLoading(false)
//         setVerifying(false)
//         return
//       }

//       try {
//         // Step 1: Verify payment with Paystack
//         const verifyRes = await fetch(`/api/paystack/verify?reference=${reference}`)
//         const verifyData = await verifyRes.json()
        
//         if (!verifyData.success) {
//           setError(`Payment verification failed: ${verifyData.message}`)
//           setVerifying(false)
//           setLoading(false)
//           return
//         }

//         setVerifying(false)
        
//         // Step 2: Fetch booking details
//         const bookingRes = await fetch(`/api/booking/${verifyData.bookingId}`)
//         if (bookingRes.ok) {
//           const bookingData = await bookingRes.json()
//           setBooking(bookingData)
//         } else {
//           setError("Failed to load booking details")
//         }
        
//       } catch (err: any) {
//         setError(err.message || "An error occurred")
//       } finally {
//         setLoading(false)
//       }
//     }

//     verifyAndFetch()
//   }, [reference])

//   // Handle payment failure
//   if (status === "failed") {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
//           <div className="flex justify-center mb-6">
//             <div className="bg-red-100 p-3 rounded-full">
//               <AlertCircle className="h-12 w-12 text-red-600" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             Payment Failed ❌
//           </h1>
//           <p className="text-gray-600 mb-6">
//             Your payment was not successful. Please try again or contact support.
//           </p>
//           <div className="space-y-4">
//             <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
//               <Link href="/booking">
//                 Try Again
//               </Link>
//             </Button>
//             <Button asChild variant="outline" className="w-full">
//               <Link href="/">
//                 Return to Home
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Show loading/verifying state
//   if (loading || verifying) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
//           <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">
//             {verifying ? "Verifying Payment..." : "Loading Booking Details..."}
//           </h2>
//           <p className="text-gray-600">
//             Please wait while we process your payment and booking information.
//           </p>
//           {reference && (
//             <p className="text-sm text-gray-500 mt-4">
//               Reference: <code className="bg-gray-100 px-2 py-1 rounded">{reference}</code>
//             </p>
//           )}
//         </div>
//       </div>
//     )
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
//           <div className="flex justify-center mb-6">
//             <div className="bg-red-100 p-3 rounded-full">
//               <AlertCircle className="h-12 w-12 text-red-600" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             Something Went Wrong
//           </h1>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <div className="space-y-4">
//             <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
//               <Link href="/book">
//                 Try Booking Again
//               </Link>
//             </Button>
//             <Button asChild variant="outline" className="w-full">
//               <Link href="/">
//                 Return to Home
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   // Show success page with booking details
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Success Header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-6">
//             <div className="bg-green-100 p-4 rounded-full">
//               <CheckCircle className="h-16 w-16 text-green-600" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Booking Confirmed! 🎉
//           </h1>
//           <p className="text-lg text-gray-600">
//             Thank you for your booking! Your deposit payment was successful.
//           </p>
//           {booking && (
//             <p className="text-sm text-gray-500 mt-2">
//               Booking ID: <span className="font-mono font-bold">#{booking.id}</span>
//             </p>
//           )}
//         </div>

//         {/* Booking Details Card */}
//         {booking && (
//           <div className="text-gray-800 rounded-2xl shadow-lg p-8 mb-8">
//             <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
            
//             <div className="grid md:grid-cols-2 gap-6">
//               {/* Service Info */}
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <h3 className="font-semibold">Service & Schedule</h3>
//                     <p className="text-gray-700">{booking.service.name}</p>
//                     <p className="text-sm text-gray-600">
//                       {new Date(booking.date).toLocaleDateString('en-US', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                     <p className="text-sm text-gray-600">Time: {booking.timeSlot}</p>
//                   </div>
//                 </div>

//                 {/* Vehicle Info */}
//                 <div className="flex items-start space-x-3">
//                   <Car className="h-5 w-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <h3 className="font-semibold">Vehicle Details</h3>
//                     <p className="text-gray-700">
//                       {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       Plate: {booking.vehicle.plate} • Color: {booking.vehicle.color || "Not specified"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Customer Info */}
//               <div className="space-y-4">
//                 <div className="flex items-start space-x-3">
//                   <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <h3 className="font-semibold">Customer Information</h3>
//                     <p className="text-gray-700">{booking.customer.name}</p>
//                     <p className="text-sm text-gray-600">{booking.customer.email}</p>
//                     <p className="text-sm text-gray-600">{booking.customer.phone}</p>
//                   </div>
//                 </div>

//                 {/* Payment Info */}
//                 <div className="flex items-start space-x-3">
//                   <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
//                   <div>
//                     <h3 className="font-semibold">Payment Status</h3>
//                     <p className="text-green-700 font-medium">Deposit Paid ✓</p>
//                     <p className="text-sm text-gray-600">
//                       Amount: ₦{booking.service.price.toLocaleString()}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Reference: {reference}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Pickup Info */}
//             {booking.pickupDropoff && (
//               <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h3 className="font-semibold text-blue-800 mb-2">🚗 Pickup & Drop-off Service</h3>
//                 <p className="text-sm text-blue-700">
//                   Our driver will contact you 30 minutes before the scheduled time to arrange pickup.
//                   Please ensure your vehicle is accessible at the provided location.
//                 </p>
//               </div>
//             )}

//             {/* Important Notes */}
//             <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//               <h3 className="font-semibold text-yellow-800 mb-2">📋 Important Notes</h3>
//               <ul className="text-sm text-yellow-700 space-y-1">
//                 <li>• Please arrive 10 minutes before your scheduled time</li>
//                 <li>• Bring a valid ID for verification</li>
//                 <li>• Remove all personal belongings from your vehicle</li>
//                 <li>• Service duration is approximate and may vary</li>
//                 <li>• Contact us if you need to reschedule (24 hours notice required)</li>
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg">
//             <Link href="/">
//               Return to Home
//             </Link>
//           </Button>
          
//           <Button asChild variant="outline" className="w-full h-14 text-lg">
//             <Link href="/book">
//               Book Another Service
//             </Link>
//           </Button>
//         </div>

//         {/* Contact Info */}
//         <div className="mt-8 text-center">
//           <p className="text-gray-600 mb-2">Need help with your booking?</p>
//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
//             <div className="flex items-center space-x-2">
//               <Phone className="h-4 w-4 text-gray-500" />
//               <span className="text-gray-700">070-315-8078</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Mail className="h-4 w-4 text-gray-500" />
//               <span className="text-gray-700">info@refinishphc.com</span>
//             </div>
//           </div>
//           <p className="text-xs text-gray-500 mt-4">
//             A confirmation email has been sent to your inbox. Please check your spam folder if you don't see it.
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


// app/(public)/booking/success/page.tsx
"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Calendar, Car, Mail, Phone, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from 'next/image'

type BookingDetails = {
  id: number
  date: string
  timeSlot: string
  pickupDropoff: boolean
  status: string
  depositPaid: boolean
  service: {
    name: string
    price: number
  }
  vehicle: {
    make: string
    model: string
    year: number
    plate: string
    color: string | null
  }
  customer: {
    name: string
    email: string
    phone: string
  }
}

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference')
  const status = searchParams.get('status')
  
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(true)
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Combined useEffect for verification
  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!reference) {
        setError("No payment reference found")
        setLoading(false)
        setVerifying(false)
        return
      }

      console.log("🔍 Starting verification for reference:", reference)

      try {
        // Step 1: Verify payment with Paystack
        const verifyRes = await fetch(`/api/paystack/verify?reference=${reference}`)
        const verifyData = await verifyRes.json()
        
        console.log("🔍 Verify API response:", verifyData)
        
        if (!verifyData.success) {
          console.log("❌ Verification failed:", verifyData.message)
          setError(`Payment verification failed: ${verifyData.message}`)
          setVerifying(false)
          setLoading(false)
          return
        }

        console.log("✅ Verification successful, bookingId:", verifyData.bookingId)
        setVerifying(false)
        
        // Step 2: Fetch booking details
        const bookingRes = await fetch(`/api/booking/${verifyData.bookingId}`)
        console.log("🔍 Booking fetch response status:", bookingRes.status)
        
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json()
          console.log("✅ Booking data loaded:", bookingData)
          setBooking(bookingData)
        } else {
          const errorText = await bookingRes.text()
          console.log("❌ Booking fetch failed:", errorText)
          setError("Failed to load booking details")
        }
        
      } catch (err: any) {
        console.error("❌ Error in verifyAndFetch:", err)
        setError(err.message || "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    verifyAndFetch()
  }, [reference])

  // Handle payment failure
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed ❌
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment was not successful. Please try again or contact support.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/booking">
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading/verifying state
  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {verifying ? "Verifying Payment..." : "Loading Booking Details..."}
          </h2>
          <p className="text-gray-600">
            Please wait while we process your payment and booking information.
          </p>
          {reference && (
            <p className="text-sm text-gray-500 mt-4">
              Reference: <code className="bg-gray-100 px-2 py-1 rounded">{reference}</code>
            </p>
          )}
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-4">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/book">
                Try Booking Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show success page with booking details
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <Image src="/logo.png" alt='logo' width={100} height={100} />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your booking! Your deposit payment was successful.
          </p>
          {booking && (
            <p className="text-sm text-gray-500 mt-2">
              Booking ID: <span className="font-mono font-bold">#{booking.id}</span>
            </p>
          )}
        </div>

        {/* Booking Details Card */}
        {booking && (
          <div className="text-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Service Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Service & Schedule</h3>
                    <p className="text-gray-700">{booking.service.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">Time: {booking.timeSlot}</p>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="flex items-start space-x-3">
                  <Car className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Vehicle Details</h3>
                    <p className="text-gray-700">
                      {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      Plate: {booking.vehicle.plate} • Color: {booking.vehicle.color || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Customer Information</h3>
                    <p className="text-gray-700">{booking.customer.name}</p>
                    <p className="text-sm text-gray-600">{booking.customer.email}</p>
                    <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Payment Status</h3>
                    <p className="text-green-700 font-medium">Deposit Paid ✓</p>
                    <p className="text-sm text-gray-600">
                      Amount: ₦{booking.service.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reference: {reference}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Info */}
            {booking.pickupDropoff && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">🚗 Pickup & Drop-off Service</h3>
                <p className="text-sm text-blue-700">
                  Our driver will contact you 30 minutes before the scheduled time to arrange pickup.
                  Please ensure your vehicle is accessible at the provided location.
                </p>
              </div>
            )}

            {/* Important Notes */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">📋 Important Notes</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Please arrive 10 minutes before your scheduled time</li>
                <li>• Bring a valid ID for verification</li>
                <li>• Remove all personal belongings from your vehicle</li>
                <li>• Service duration is approximate and may vary</li>
                <li>• Contact us if you need to reschedule (24 hours notice required)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full h-14 text-lg">
            <Link href="/booking">
              Book Another Service
            </Link>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your booking?</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">070-315-8078</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">info@refinishphc.com</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            A confirmation email has been sent to your inbox. Please check your spam folder if you don't see it.
          </p>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we load your booking information.
          </p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}