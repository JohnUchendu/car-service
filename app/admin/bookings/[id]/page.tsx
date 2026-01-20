// app/(admin)/bookings/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"
import { 
  ArrowLeft, 
  Calendar, 
  Car, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Printer
} from "lucide-react"
import { getBookingById, updateBookingStatus, recordPayment } from "@/lib/actions"
import { Booking } from "@/types/booking";

// Update in your admin pages to handle the transformed data
// interface Booking {
//   id: number
//   date: string
//   timeSlot: string
//   status: string
//   notes: string | null
//   amountPaid: number | null  // Now number instead of Decimal
//   paymentDate: string | null
//   paymentMethod: string | null
//   paymentNotes: string | null
//     createdAt: string       // Add this field
//   updatedAt: string       // Add this field
//   customer: {
//     name: string
//     email: string
//     phone: string

//   }
//   vehicle: {
//     make: string
//     model: string
//     year: number
//     plate: string
//     color: string | null
//   }
//   service: {
//     name: string
//     price: number  // Now number instead of Decimal
//     duration: number
//   }
// }

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBooking()
  }, [params.id])

  const loadBooking = async () => {
    const id = Number(params.id)
    if (isNaN(id)) {
      router.push("/admin/bookings")
      return
    }

    setLoading(true)
    const result = await getBookingById(id)
    
    if (result.success && result.data) {
      setBooking(result.data)
    } else {
      toast.error(result.error || "Failed to load booking")
      router.push("/admin/bookings")
    }
    setLoading(false)
  }

  const handleStatusUpdate = async (status: string) => {
    if (!booking) return

    const result = await updateBookingStatus(booking.id, status)
    
    if (result.success) {
      toast.success(result.message)
      loadBooking()
    } else {
      toast.error(result.error || "Failed to update status")
    }
  }

  const handleRecordPayment = async () => {
    if (!booking) return

    const amount = prompt(`Enter payment amount (Service: ₦${booking.service.price.toLocaleString()}):`)
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error("Invalid amount")
      return
    }

    const method = prompt("Payment method (cash/card/transfer/pos/other):") || "cash"
    
    const result = await recordPayment(booking.id, {
      amountPaid: parseFloat(amount),
      paymentMethod: method
    })
    
    if (result.success) {
      toast.success(result.message)
      loadBooking()
    } else {
      toast.error(result.error || "Failed to record payment")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "CONFIRMED": return "bg-blue-100 text-blue-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading booking details...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Booking not found</p>
        <Link href="/admin/bookings" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to bookings
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4  ">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className=" text-2xl font-bold">Booking #{booking.id}</h1>
            <p className="text-gray-600">Booking details and management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="text-green-800 grid md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          {/* Status card */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-lg">Booking Status</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    Created: {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
              
              {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200"
                    onClick={() => handleStatusUpdate("COMPLETED")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200"
                    onClick={() => handleStatusUpdate("CANCELLED")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Service details */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Service Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{booking.service.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  ₦{Number(booking.service.price).toLocaleString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{format(new Date(booking.date), "EEEE, MMMM dd, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Slot</p>
                  <p className="font-medium">{booking.timeSlot}</p>
                </div>
              </div>
              
              {booking.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Customer Notes</p>
                  <p className="mt-1">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{booking.customer.name}</h3>
                  <p className="text-gray-600">{booking.customer.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </p>
                  <p className="font-medium">{booking.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium">{booking.customer.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Payment info */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h2>
            
            {booking.amountPaid ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    ₦{booking.amountPaid.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">{booking.paymentMethod}</p>
                  </div>
                  {booking.paymentDate && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Date</p>
                      <p className="font-medium">
                        {format(new Date(booking.paymentDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  )}
                  {booking.paymentNotes && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Notes</p>
                      <p className="font-medium">{booking.paymentNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">No payment recorded yet</p>
                <Button onClick={handleRecordPayment}>
                  Record Payment
                </Button>
              </div>
            )}
          </div>

          {/* Vehicle info */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">
                  {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Plate Number</p>
                <p className="font-medium">{booking.vehicle.plate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Color</p>
                <p className="font-medium">{booking.vehicle.color || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {!booking.amountPaid && booking.status !== "CANCELLED" && (
                <Button onClick={handleRecordPayment} className="w-full">
                  Record Payment
                </Button>
              )}
              
              {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                <>
                  <Button
                    variant="outline"
                    className="w-full text-green-600 border-green-200"
                    onClick={() => handleStatusUpdate("COMPLETED")}
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-200"
                    onClick={() => handleStatusUpdate("CANCELLED")}
                  >
                    Cancel Booking
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}