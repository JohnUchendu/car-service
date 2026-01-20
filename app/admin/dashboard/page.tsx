// // app/(admin)/dashboard/page.tsx
// import { getDashboardStats } from "@/lib/actions"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Calendar, Clock, DollarSign, Users, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
// import Link from "next/link"

// export default async function DashboardPage() {
//   const statsResult = await getDashboardStats()

//   if (!statsResult.success) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-red-600">Failed to load dashboard stats</p>
//       </div>
//     )
//   }

//   const stats = statsResult.data

//   const statCards = [
//     {
//       title: "Today's Bookings",
//       value: stats.todayBookings,
//       icon: Calendar,
//       color: "text-blue-600",
//       bgColor: "bg-blue-100",
//       change: "+12%",
//       positive: true
//     },
//     {
//       title: "Pending",
//       value: stats.pendingBookings,
//       icon: Clock,
//       color: "text-yellow-600",
//       bgColor: "bg-yellow-100",
//       change: "-3%",
//       positive: false
//     },
//     {
//       title: "Total Revenue",
//       value: `₦${stats.totalRevenue.toLocaleString()}`,
//       icon: DollarSign,
//       color: "text-green-600",
//       bgColor: "bg-green-100",
//       change: "+20%",
//       positive: true
//     },
//     {
//       title: "Total Customers",
//       value: stats.totalCustomers,
//       icon: Users,
//       color: "text-purple-600",
//       bgColor: "bg-purple-100",
//       change: "+8%",
//       positive: true
//     }
//   ]

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Dashboard</h1>
//         <p className="text-gray-600">Welcome back! Here's your business overview.</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statCards.map((stat, index) => (
//           <Card key={index}>
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-sm font-medium">
//                 {stat.title}
//               </CardTitle>
//               <div className={`p-2 rounded-lg ${stat.bgColor}`}>
//                 <stat.icon className={`h-5 w-5 ${stat.color}`} />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <div className="flex items-center mt-2">
//                 <span className={`text-xs flex items-center ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
//                   {stat.positive ? (
//                     <TrendingUp className="h-3 w-3 mr-1" />
//                   ) : (
//                     <TrendingDown className="h-3 w-3 mr-1" />
//                   )}
//                   {stat.change}
//                 </span>
//                 <span className="text-xs text-gray-500 ml-2">from last week</span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Stats</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <CheckCircle className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Completed Today</p>
//                   <p className="text-2xl font-bold">{stats.completedToday}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-between items-center">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//                   <Calendar className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Upcoming Bookings</p>
//                   <p className="text-2xl font-bold">{stats.upcomingBookings}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="pt-4 border-t">
//               <Link 
//                 href="/admin/bookings" 
//                 className="text-blue-600 hover:underline flex items-center"
//               >
//                 View all bookings →
//               </Link>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               <Link
//                 href="/admin/bookings"
//                 className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border transition-colors"
//               >
//                 <p className="font-medium">Manage Bookings</p>
//                 <p className="text-sm text-gray-600">View, update, and manage all bookings</p>
//               </Link>
//               <div className="p-4 bg-blue-50 rounded-lg border">
//                 <p className="font-medium">Need Help?</p>
//                 <p className="text-sm text-gray-600">Contact support if you need assistance</p>
//                 <p className="text-sm text-blue-600 mt-2">support@refinishphc.com</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }



// app/(admin)/dashboard/page.tsx
import { getDashboardStats } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, DollarSign, Users, CheckCircle, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const statsResult = await getDashboardStats()

  if (!statsResult.success || !statsResult.data) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load dashboard stats</p>
        <p className="text-gray-600 text-sm mt-2">Please try refreshing the page</p>
      </div>
    )
  }

  const stats = statsResult.data

  const statCards = [
    {
      title: "Today's Bookings",
      value: stats.todayBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      positive: true
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      change: "-3%",
      positive: false
    },
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+20%",
      positive: true
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+8%",
      positive: true
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-2">
                <span className={`text-xs flex items-center ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.positive ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-2">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Completed Today</p>
                  <p className="text-2xl font-bold">{stats.completedToday}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Upcoming Bookings</p>
                  <p className="text-2xl font-bold">{stats.upcomingBookings}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Link 
                href="/admin/bookings" 
                className="text-blue-600 hover:underline flex items-center"
              >
                View all bookings →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/admin/bookings"
                className="block p-4 hover:bg-gray-100 rounded-lg border transition-colors"
              >
                <p className="font-medium">Manage Bookings</p>
                <p className="text-sm text-gray-600">View, update, and manage all bookings</p>
              </Link>
              <div className="p-4  rounded-lg border">
                <p className="font-medium">Need Help?</p>
                <p className="text-sm text-gray-600">Contact support if you need assistance</p>
                <p className="text-sm text-blue-600 mt-2">info@refinishphc.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}