

// components/portal/RecentBookings.tsx
"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Booking {
  id: number
  date: string
  timeSlot: string
  status: string
  depositPaid: boolean
  customer: {
    name: string
    phone: string
  }
  vehicle: {
    make: string
    model: string
    plate: string
  }
  service: {
    name: string
    price: number
  }
  payment?: {
    amount: number
  }
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredBookings = selectedStatus === "all" 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedStatus)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-800 border border-green-200"
      case "PENDING": return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "COMPLETED": return "bg-blue-100 text-blue-800 border border-blue-200"
      case "CANCELLED": return "bg-red-100 text-red-800 border border-red-200"
      default: return "bg-gray-100 text-gray-800 border border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <p className="text-sm text-gray-500">Manage and track all bookings</p>
          </div>
          <div className="flex space-x-2">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <Button size="sm">Export</Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">#{booking.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.customer.name}</p>
                    <p className="text-sm text-gray-500">{booking.customer.phone}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.vehicle.make} {booking.vehicle.model}</p>
                    <p className="text-sm text-gray-500">{booking.vehicle.plate}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.service.name}</p>
                    <p className="text-sm text-gray-500">
                      ₦{booking.service.price.toLocaleString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{formatDate(booking.date)}</p>
                    <p className="text-sm text-gray-500">{booking.timeSlot}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      ₦{booking.payment?.amount?.toLocaleString() || "0"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {booking.depositPaid ? "Deposit paid" : "Pending"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Complete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredBookings.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No bookings found with the selected status
        </div>
      )}
    </div>
  )
}