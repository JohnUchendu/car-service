// lib/actions.ts
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Validation schemas
const updateBookingSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  amountPaid: z.number().optional(),
  paymentDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentNotes: z.string().optional(),
  notes: z.string().optional()
}).partial()

// Booking Actions
// export async function getDashboardStats() {
//   try {
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     const tomorrow = new Date(today)
//     tomorrow.setDate(tomorrow.getDate() + 1)

//     const oneWeekLater = new Date(today)
//     oneWeekLater.setDate(today.getDate() + 7)

//     const [
//       todayBookings,
//       pendingBookings,
//       totalBookings,
//       totalCustomers,
//       totalRevenue,
//       completedToday,
//       upcomingBookings
//     ] = await Promise.all([
//       // Today's bookings
//       prisma.booking.count({
//         where: {
//           date: {
//             gte: today,
//             lt: tomorrow
//           }
//         }
//       }),
      
//       // Pending bookings
//       prisma.booking.count({
//         where: { status: "PENDING" }
//       }),
      
//       // Total bookings
//       prisma.booking.count(),
      
//       // Total customers
//       prisma.customer.count(),
      
//       // Total revenue
//       prisma.booking.aggregate({
//         where: {
//           amountPaid: { not: null }
//         },
//         _sum: {
//           amountPaid: true
//         }
//       }),
      
//       // Completed today
//       prisma.booking.count({
//         where: {
//           status: "COMPLETED",
//           updatedAt: {
//             gte: today,
//             lt: tomorrow
//           }
//         }
//       }),
      
//       // Upcoming bookings (next 7 days)
//       prisma.booking.count({
//         where: {
//           date: {
//             gte: tomorrow,
//             lt: oneWeekLater
//           },
//           status: {
//             in: ["PENDING", "CONFIRMED"]
//           }
//         }
//       })
//     ])

//     return {
//       success: true,
//       data: {
//         todayBookings,
//         pendingBookings,
//         totalBookings,
//         totalCustomers,
//         totalRevenue: Number(totalRevenue._sum.amountPaid) || 0,
//         completedToday,
//         upcomingBookings
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error)
//     return { success: false, error: "Failed to fetch dashboard stats" }
//   }
// }

// lib/actions.ts - getDashboardStats function
export async function getDashboardStats() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Do fewer queries - combine where possible
    const [
      bookingsCounts,
      totalStats
    ] = await Promise.all([
      // Combined bookings query
      prisma.$transaction([
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
        // Completed today
        prisma.booking.count({
          where: {
            status: "COMPLETED",
            updatedAt: {
              gte: today,
              lt: tomorrow
            }
          }
        })
      ]),
      
      // Get total stats in one query
      prisma.$transaction(async (tx) => {
        const totalCustomers = await tx.customer.count()
        const totalRevenue = await tx.booking.aggregate({
          where: { amountPaid: { not: null } },
          _sum: { amountPaid: true }
        })
        const totalBookings = await tx.booking.count()
        
        return {
          totalCustomers,
          totalRevenue: Number(totalRevenue._sum.amountPaid) || 0,
          totalBookings
        }
      })
    ])

    // Get upcoming bookings separately to reduce load
    const upcomingBookings = await prisma.booking.count({
      where: {
        date: {
          gte: tomorrow,
          lt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days later
        },
        status: {
          in: ["PENDING", "CONFIRMED"]
        }
      }
    })

    return {
      success: true,
      data: {
        todayBookings: bookingsCounts[0],
        pendingBookings: bookingsCounts[1],
        completedToday: bookingsCounts[2],
        totalCustomers: totalStats.totalCustomers,
        totalRevenue: totalStats.totalRevenue,
        totalBookings: totalStats.totalBookings,
        upcomingBookings
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch dashboard stats" 
    }
  }
}




// export async function getAllBookings(search?: string, status?: string) {
//   try {
//     const where: any = {}
    
//     if (status && status !== "all") {
//       where.status = status
//     }

//     let bookings = await prisma.booking.findMany({
//       where,
//       include: {
//         service: true,
//         customer: true,
//         vehicle: true
//       },
//       orderBy: {
//         createdAt: "desc"
//       }
//     })

//     // Apply search filter on client side
//     if (search) {
//       const searchLower = search.toLowerCase()
//       bookings = bookings.filter((booking: { customer: { name: string; phone: string | string[] }; vehicle: { plate: string }; service: { name: string }; id: { toString: () => string | string[] } }) => 
//         booking.customer.name.toLowerCase().includes(searchLower) ||
//         booking.customer.phone.includes(search) ||
//         booking.vehicle.plate.toLowerCase().includes(searchLower) ||
//         booking.service.name.toLowerCase().includes(searchLower) ||
//         booking.id.toString().includes(search)
//       )
//     }

//     return { success: true, data: bookings }
//   } catch (error) {
//     console.error("Error fetching bookings:", error)
//     return { success: false, error: "Failed to fetch bookings" }
//   }
// }

// export async function getBookingById(id: number) {
//   try {
//     const booking = await prisma.booking.findUnique({
//       where: { id },
//       include: {
//         service: true,
//         customer: true,
//         vehicle: true
//       }
//     })

//     if (!booking) {
//       return { success: false, error: "Booking not found" }
//     }

//     return { success: true, data: booking }
//   } catch (error) {
//     console.error("Error fetching booking:", error)
//     return { success: false, error: "Failed to fetch booking" }
//   }
// }

// export async function getAllBookings() {
//   try {
//     const bookings = await prisma.booking.findMany({
//       include: {
//         service: true,
//         customer: true,
//         vehicle: true,
//       },
//       orderBy: {
//         date: 'desc', // or whatever ordering you prefer
//       },
//     });

//     // Transform for frontend safety
//     const safeBookings = bookings.map((booking) => ({
//       ...booking,
//       // Dates → string
//       date: booking.date.toISOString().split('T')[0], // "2025-01-14" format
//       // createdAt: booking.createdAt.toISOString(),
//       // updatedAt: booking.updatedAt?.toISOString() || null,

//       // Decimal → number (very important!)
//       service: {
//         ...booking.service,
//         price: Number(booking.service.price),
//       },

//       // Optional: make customer & vehicle more predictable
//       customer: {
//         name: booking.customer.name,
//         phone: booking.customer.phone,
//         // email: booking.customer.email || null,
//       },
//       vehicle: {
//         make: booking.vehicle.make,
//         model: booking.vehicle.model,
//         plate: booking.vehicle.plate,
//       },
//     }));

//     return { success: true, data: safeBookings };
//   } catch (error) {
//     console.error("Error fetching bookings:", error);
//     return { success: false, error: "Failed to load bookings" };
//   }
// }

export async function getAllBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        customer: true,
        vehicle: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const safeBookings = bookings.map((b) => ({
      ...b,

      // Dates → string (ISO format is safe and sortable)
      date:        b.date.toISOString().split('T')[0],          // "2025-01-14"
      createdAt:   b.createdAt.toISOString(),
      updatedAt:   b.updatedAt.toISOString(),

      // Important: also convert paymentDate
      paymentDate: b.paymentDate ? b.paymentDate.toISOString() : null,

      // Decimal → number
      amountPaid: b.amountPaid ? Number(b.amountPaid) : null,

      service: {
        ...b.service,
        price: Number(b.service.price),
      },

      // Flatten/select only what the frontend actually uses
      // (helps catch missing/extra fields early)
      customer: {
        name:  b.customer.name,
        phone: b.customer.phone,
        email: b.customer.email,
      },
      vehicle: {
        make:  b.vehicle.make,
        model: b.vehicle.model,
        year:  b.vehicle.year,
        plate: b.vehicle.plate,
        color: b.vehicle.color ?? null,
      },
    }));

    return { success: true, data: safeBookings };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { success: false, error: "Failed to load bookings" };
  }
}

// export async function getBookingById(id: number) {
//   try {
//     const booking = await prisma.booking.findUnique({
//       where: { id },
//       include: {
//         service: true,
//         customer: true,
//         vehicle: true
//       }
//     })

//     if (!booking) {
//       return { success: false, error: "Booking not found" }
//     }

//     // Transform dates & Decimal → numbers/strings
//     const safeBooking = {
//       ...booking,
//       date: booking.date.toISOString().split('T')[0], // "2025-01-14"
//       // or: booking.date.toLocaleDateString('en-GB'),
//       // createdAt: booking.createdAt.toISOString(),
//       // updatedAt: booking.updatedAt?.toISOString(),

//       service: {
//         ...booking.service,
//         price: Number(booking.service.price),     // Decimal → number
//         // duration remains number
//       },

//       // Optional: if you want consistent date format everywhere
//       // createdAt: booking.createdAt.toISOString(),
//     }

//     return { success: true, data: safeBooking }
//   } catch (error) {
//     console.error("Error fetching booking:", error)
//     return { success: false, error: "Failed to fetch booking" }
//   }
// }

export async function getBookingById(id: number) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        customer: true,
        vehicle: true,
      },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const safeBooking = {
      ...booking,
      date: booking.date.toISOString().split("T")[0],
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),

      amountPaid: booking.amountPaid ? Number(booking.amountPaid) : null,

      paymentDate: booking.paymentDate ? booking.paymentDate.toISOString() : null,

      service: {
        ...booking.service,
        price: Number(booking.service.price),
      },

      customer: {
        name: booking.customer.name,
        email: booking.customer.email,
        phone: booking.customer.phone,
      },

      vehicle: {
        make: booking.vehicle.make,
        model: booking.vehicle.model,
        year: booking.vehicle.year,
        plate: booking.vehicle.plate,
        color: booking.vehicle.color,
      },
    };

    return { success: true, data: safeBooking };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { success: false, error: "Failed to fetch booking" };
  }
}

export async function updateBooking(id: number, data: any) {
  try {
    // Validate input
    const validatedData = updateBookingSchema.parse(data)
    
    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Convert paymentDate string to Date object if provided
    if (validatedData.paymentDate) {
      updateData.paymentDate = new Date(validatedData.paymentDate)
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData
    })

    revalidatePath("/admin/bookings")
    revalidatePath(`/admin/bookings/${id}`)
    
    return { 
      success: true, 
      message: "Booking updated successfully",
      data: updatedBooking
    }
  } catch (error) {
    console.error("Error updating booking:", error)
    return { success: false, error: "Failed to update booking" }
  }
}

// export async function updateBookingStatus(id: number, status: string) {
//   try {
//     await prisma.booking.update({
//       where: { id },
//       data: { status }
//     })

//     revalidatePath("/admin/bookings")
//     revalidatePath(`/admin/bookings/${id}`)
    
//     return { 
//       success: true, 
//       message: `Booking status updated to ${status}` 
//     }
//   } catch (error) {
//     console.error("Error updating booking status:", error)
//     return { success: false, error: "Failed to update booking status" }
//   }
// }


export async function updateBookingStatus(id: number, status: string) {
  try {
    // Cast status to the correct Prisma enum type
    const statusEnum = status as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
    
    await prisma.booking.update({
      where: { id },
      data: { status: statusEnum }
    })

    revalidatePath("/admin/bookings")
    revalidatePath(`/admin/bookings/${id}`)
    
    return { 
      success: true, 
      message: `Booking status updated to ${status}` 
    }
  } catch (error) {
    console.error("Error updating booking status:", error)
    return { success: false, error: "Failed to update booking status" }
  }
}

// export async function recordPayment(id: number, data: {
//   amountPaid: number
//   paymentMethod: string
//   paymentDate?: string
//   paymentNotes?: string
// }) {
//   try {
//     const updateData = {
//       amountPaid: data.amountPaid,
//       paymentMethod: data.paymentMethod,
//       paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
//       paymentNotes: data.paymentNotes,
//       status: "COMPLETED" as const
//     }

//     await prisma.booking.update({
//       where: { id },
//       data: updateData
//     })

//     revalidatePath("/admin/bookings")
//     revalidatePath(`/admin/bookings/${id}`)
    
//     return { 
//       success: true, 
//       message: "Payment recorded successfully" 
//     }
//   } catch (error) {
//     console.error("Error recording payment:", error)
//     return { success: false, error: "Failed to record payment" }
//   }
// }

export async function recordPayment(id: number, data: {
  amountPaid: number
  paymentMethod: string
  paymentDate?: string
  paymentNotes?: string
}) {
  try {
    const updateData = {
      amountPaid: data.amountPaid,
      paymentMethod: data.paymentMethod,
      paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
      paymentNotes: data.paymentNotes,
      status: "COMPLETED" as const  // Already correctly typed
    }

    await prisma.booking.update({
      where: { id },
      data: updateData
    })

    revalidatePath("/admin/bookings")
    revalidatePath(`/admin/bookings/${id}`)
    
    return { 
      success: true, 
      message: "Payment recorded successfully" 
    }
  } catch (error) {
    console.error("Error recording payment:", error)
    return { success: false, error: "Failed to record payment" }
  }
}


// export async function deleteBooking(id: number) {
//   try {
//     await prisma.booking.update({
//       where: { id },
//       data: { status: "CANCELLED" }
//     })

//     revalidatePath("/admin/bookings")
    
//     return { 
//       success: true, 
//       message: "Booking cancelled successfully" 
//     }
//   } catch (error) {
//     console.error("Error deleting booking:", error)
//     return { success: false, error: "Failed to cancel booking" }
//   }
// }


export async function deleteBooking(id: number) {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" as const }  // Add type assertion here too
    })

    revalidatePath("/admin/bookings")
    
    return { 
      success: true, 
      message: "Booking cancelled successfully" 
    }
  } catch (error) {
    console.error("Error deleting booking:", error)
    return { success: false, error: "Failed to cancel booking" }
  }
}