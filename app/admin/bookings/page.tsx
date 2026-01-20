// app/(admin)/bookings/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Search, RefreshCw } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { getAllBookings, updateBookingStatus, recordPayment } from "@/lib/actions"
import { Booking } from "@/types/booking";

// interface Booking {
//   id: number
//   date: string
//   timeSlot: string
//   status: string
//   amountPaid: number | null
//   paymentMethod: string | null
//   customer: {
//     name: string
//     phone: string
//   }
//   vehicle: {
//     make: string
//     model: string
//     plate: string
//   }
//   service: {
//     name: string
//     price: number
//   }
// }

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    const result = await getAllBookings()
    
    if (result.success && result.data) {
      setBookings(result.data)
    } else {
      toast.error(result.error || "Failed to load bookings")
    }
    setLoading(false)
  }

  const filteredBookings = bookings
    .filter(booking => {
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false
      }
      if (!search) return true
      
      const searchLower = search.toLowerCase()
      return (
        booking.customer.name.toLowerCase().includes(searchLower) ||
        booking.customer.phone.includes(search) ||
        booking.vehicle.plate.toLowerCase().includes(searchLower) ||
        booking.service.name.toLowerCase().includes(searchLower) ||
        booking.id.toString().includes(search)
      )
    })

  const handleStatusUpdate = async (id: number, status: string) => {
    const result = await updateBookingStatus(id, status)
    
    if (result.success) {
      toast.success(result.message)
      loadBookings()
    } else {
      toast.error(result.error || "Failed to update status")
    }
  }

  const handleRecordPayment = async (id: number) => {
    const booking = bookings.find(b => b.id === id)
    if (!booking) return

    const amount = prompt(`Enter payment amount (Service: ₦${booking.service.price.toLocaleString()}):`)
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error("Invalid amount")
      return
    }

    const method = prompt("Payment method (cash/card/transfer/pos/other):") || "cash"
    
    const result = await recordPayment(id, {
      amountPaid: parseFloat(amount),
      paymentMethod: method
    })
    
    if (result.success) {
      toast.success(result.message)
      loadBookings()
    } else {
      toast.error(result.error || "Failed to record payment")
    }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Bookings</h1>
          <p className="text-gray-600">Manage customer appointments</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline">← Dashboard</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, phone, or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <Button variant="outline" onClick={loadBookings}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-2xl font-bold">{bookings.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className=" p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === "PENDING").length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === "COMPLETED").length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-2xl font-bold">
            ₦{bookings
              .filter(b => b.amountPaid)
              .reduce((sum, b) => sum + (b.amountPaid || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Revenue</div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 text-gray-900">
          No bookings found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white text-green-800 p-4 rounded-lg border">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold">#{booking.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="font-medium">{booking.customer.name}</p>
                    <p className="text-sm text-gray-600">{booking.customer.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm">
                      {booking.vehicle.make} {booking.vehicle.model} • {booking.vehicle.plate}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.service.name} • ₦{Number(booking.service.price).toLocaleString()}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    {format(new Date(booking.date), "MMM dd, yyyy")} • {booking.timeSlot.split("-")[0]}
                  </p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  <Link href={`/admin/bookings/${booking.id}`}>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </Link>
                  
                  {booking.status !== "COMPLETED" && booking.status !== "CANCELLED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200"
                        onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200"
                        onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  
                  {!booking.amountPaid && booking.status !== "CANCELLED" && (
                    <Button
                      size="sm"
                      onClick={() => handleRecordPayment(booking.id)}
                    >
                      Record Payment
                    </Button>
                  )}
                </div>
              </div>

              {booking.amountPaid && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-green-600 font-medium">
                    Paid: ₦{booking.amountPaid.toLocaleString()} via {booking.paymentMethod}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}