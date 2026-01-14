
// app/(portal)/dashboard/page.tsx
import { prisma } from "@/lib/prisma"
import { DashboardCards } from "@/components/portal/DashboardCards"
import { RecentBookings } from "@/components/portal/RecentBookings"
import { RevenueChart } from "@/components/portal/RevenueChart"

export default async function DashboardPage() {
  // Calculate date ranges
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  // Fetch all stats in parallel
  const [
    todayBookings,
    pendingBookings,
    totalCustomers,
    completedToday,
    totalRevenue,
    upcomingBookings,
    recentBookings,
    revenueData
  ] = await Promise.all([
    // Today's bookings
    prisma.booking.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    }),
    
    // Pending bookings
    prisma.booking.count({
      where: { status: "PENDING" }
    }),
    
    // Total customers
    prisma.customer.count(),
    
    // Completed today
    prisma.booking.count({
      where: {
        status: "COMPLETED",
        updatedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    }),
    
    // Total revenue (this month)
    prisma.payment.aggregate({
      where: {
        status: "SUCCESS",
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    }),
    
    // Upcoming bookings (next 7 days)
    prisma.booking.count({
      where: {
        date: {
          gte: tomorrow,
          lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    }),
    
    // Recent bookings (last 10)
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        vehicle: true,
        service: true,
        payment: true
      }
    }),
    
    // Revenue data for chart (last 6 months)
    (async () => {
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
        
        const revenue = await prisma.payment.aggregate({
          where: {
            status: "SUCCESS",
            createdAt: {
              gte: monthStart,
              lt: monthEnd
            }
          },
          _sum: { amount: true }
        })
        
        months.push({
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue: Number(revenue._sum.amount) || 0
        })
      }
      return months
    })()
  ])

  const stats = {
    todayBookings,
    pendingBookings,
    totalCustomers,
    totalRevenue: Number(totalRevenue._sum.amount) || 0,
    completedToday,
    upcomingBookings
  }

  // Transform Prisma bookings to match the RecentBookings component interface
  const transformedBookings = recentBookings.map(booking => ({
    id: booking.id,
    date: booking.date.toISOString(), // Convert Date to ISO string
    timeSlot: booking.timeSlot,
    status: booking.status,
    depositPaid: booking.depositPaid,
    customer: {
      name: booking.customer.name,
      phone: booking.customer.phone
    },
    vehicle: {
      make: booking.vehicle.make,
      model: booking.vehicle.model,
      plate: booking.vehicle.plate
    },
    service: {
      name: booking.service.name,
      price: Number(booking.service.price) // Convert Decimal to number
    },
    payment: booking.payment ? {
      amount: Number(booking.payment.amount) // Convert Decimal to number
    } : undefined
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardCards stats={stats} />

      {/* Charts & Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <RevenueChart data={revenueData} />
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Booking Value</span>
                <span className="font-semibold">₦45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold text-green-600">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Repeat Customers</span>
                <span className="font-semibold">42%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Peak Hours</span>
                <span className="font-semibold">10 AM - 2 PM</span>
              </div>
            </div>
          </div>

          {/* Service Popularity */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Popular Services</h3>
            <div className="space-y-3">
              {[
                { name: "Full Detailing", count: 45, color: "bg-blue-500" },
                { name: "Interior Cleaning", count: 32, color: "bg-green-500" },
                { name: "Exterior Wash", count: 28, color: "bg-yellow-500" },
                { name: "Ceramic Coating", count: 15, color: "bg-purple-500" },
              ].map((service) => (
                <div key={service.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{service.name}</span>
                    <span className="font-medium">{service.count} bookings</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${service.color} rounded-full`}
                      style={{ width: `${(service.count / 45) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <RecentBookings bookings={transformedBookings} />
    </div>
  )
}