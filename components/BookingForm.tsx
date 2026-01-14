// // components/BookingForm.tsx
// "use client"

// import { useState, useEffect } from "react"
// import { format, addMinutes } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Card } from "@/components/ui/card"
// import { Loader2 } from "lucide-react"

// // Import Sonner toast directly
// import { toast } from "sonner"

// type Service = {
//   id: number
//   name: string
//   description: string | null
//   price: number
//   duration: number
//   active: boolean
// }

// export function BookingForm() {
//   const [step, setStep] = useState(1)
//   const [loading, setLoading] = useState(false)
//   const [services, setServices] = useState<Service[]>([])
//   const [availableSlots, setAvailableSlots] = useState<string[]>([])

//   const [selectedService, setSelectedService] = useState<Service | null>(null)
//   const [date, setDate] = useState<Date | undefined>(undefined)
//   const [timeSlot, setTimeSlot] = useState("")
//   const [pickup, setPickup] = useState(false)

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     make: "",
//     model: "",
//     year: "",
//     plate: "",
//     color: "",
//   })

//   // Fetch services on mount
//   useEffect(() => {
//     fetchServices()
//   }, [])

//   // Fetch available slots when date changes
//   useEffect(() => {
//     if (date) {
//       fetchAvailableSlots()
//     }
//   }, [date])

//   const fetchServices = async () => {
//     try {
//       const res = await fetch("/api/services")
//       if (res.ok) {
//         const data = await res.json()
//         setServices(data)
//       } else {
//         toast.error("Failed to load services")
//       }
//     } catch (error) {
//       console.error("Error fetching services:", error)
//       toast.error("Network error – please try again")
//     }
//   }

//   const fetchAvailableSlots = async () => {
//     if (!date) return

//     try {
//       const formattedDate = format(date, "yyyy-MM-dd")
//       const res = await fetch(`/api/booking?date=${formattedDate}`)
//       if (res.ok) {
//         const data = await res.json()
//         // Expecting { availableSlots: ["09:00", "10:00", ...] }
//         setAvailableSlots(data.availableSlots || [])
//       } else {
//         toast.error("Failed to load available slots")
//       }
//     } catch (error) {
//       console.error("Error fetching slots:", error)
//       toast.error("Network error")
//     }
//   }

//   const depositAmount = selectedService
//     ? selectedService.price * 0.5 + (pickup ? 5000 : 0)
//     : 0

//   const calculateTimeSlot = (startTime: string, duration: number) => {
//     const [hours, minutes] = startTime.split(":").map(Number)
//     const startDate = new Date()
//     startDate.setHours(hours, minutes, 0, 0)

//     const endDate = addMinutes(startDate, duration)
//     const endTime = format(endDate, "HH:mm")

//     return `${startTime}-${endTime}`
//   }

//   const handleSubmit = async () => {
//     if (!selectedService || !date || !timeSlot) {
//       toast.error("Please complete all required fields")
//       return
//     }

//     const year = parseInt(formData.year)
//     if (
//       isNaN(year) ||
//       year < 1900 ||
//       year > new Date().getFullYear() + 1
//     ) {
//       toast.error("Please enter a valid vehicle year")
//       return
//     }

//     setLoading(true)

//     const loadingToast = toast.loading("Creating your booking...")

//     try {
//       const calculatedTimeSlot = calculateTimeSlot(timeSlot, selectedService.duration)

//       const res = await fetch("/api/booking", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           serviceId: selectedService.id,
//           date: date.toISOString(),
//           timeSlot: calculatedTimeSlot,
//           pickupDropoff: pickup,
//           depositAmount,
//           customer: {
//             name: formData.name.trim(),
//             email: formData.email.trim(),
//             phone: formData.phone.trim(),
//           },
//           vehicle: {
//             make: formData.make.trim(),
//             model: formData.model.trim(),
//             year,
//             plate: formData.plate.trim().toUpperCase(),
//             color: formData.color?.trim() || undefined,
//           },
//         }),
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.error || "Booking failed")
//       }

//       toast.dismiss(loadingToast)
//       toast.success("Booking created! Redirecting to payment...")

//       if (data.authorization_url) {
//         window.location.href = data.authorization_url
//       }
//     } catch (error: any) {
//       toast.dismiss(loadingToast)
//       toast.error(error.message || "Something went wrong. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-8">
//       {/* Step 1: Service Selection */}
//       {step === 1 && (
//         <div className="space-y-6">
//           <div>
//             <h2 className="text-2xl font-bold">Select a Service</h2>
//             <p className="text-gray-600">
//               Choose from our professional detailing services
//             </p>
//           </div>

//           {services.length === 0 ? (
//             <div className="text-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//               <p className="mt-2 text-gray-600">Loading services...</p>
//             </div>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-4">
//               {services
//                 .filter((s) => s.active)
//                 .map((service) => (
//                   <Card
//                     key={service.id}
//                     className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
//                       selectedService?.id === service.id
//                         ? "border-2 border-blue-500 bg-blue-50"
//                         : "border hover:border-blue-300"
//                     }`}
//                     onClick={() => {
//                       setSelectedService(service)
//                       setStep(2)
//                     }}
//                   >
//                     <h3 className="font-bold text-lg">{service.name}</h3>
//                     {service.description && (
//                       <p className="text-sm text-gray-600 mt-1">
//                         {service.description}
//                       </p>
//                     )}
//                     <p className="text-2xl font-bold text-blue-600 mt-2">
//                       ₦{service.price.toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       Duration: {Math.floor(service.duration / 60)}h{" "}
//                       {service.duration % 60}m
//                     </p>
//                   </Card>
//                 ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Step 2: Details & Scheduling */}
//       {step === 2 && selectedService && (
//         <div className="space-y-6">
//           <div>
//             <h2 className="text-2xl font-bold">Complete Your Booking</h2>
//             <p className="text-gray-600">
//               Fill in your details and schedule your appointment
//             </p>
//           </div>

//           {/* Personal Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Personal Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name *</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   placeholder="John Doe"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email *</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   placeholder="john@example.com"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number *</Label>
//                 <Input
//                   id="phone"
//                   value={formData.phone}
//                   onChange={(e) =>
//                     setFormData({ ...formData, phone: e.target.value })
//                   }
//                   placeholder="08012345678"
//                   required
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Vehicle Information */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Vehicle Information</h3>
//             <div className="grid md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="make">Make *</Label>
//                 <Input
//                   id="make"
//                   value={formData.make}
//                   onChange={(e) =>
//                     setFormData({ ...formData, make: e.target.value })
//                   }
//                   placeholder="Toyota"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="model">Model *</Label>
//                 <Input
//                   id="model"
//                   value={formData.model}
//                   onChange={(e) =>
//                     setFormData({ ...formData, model: e.target.value })
//                   }
//                   placeholder="Camry"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="year">Year *</Label>
//                 <Input
//                   id="year"
//                   value={formData.year}
//                   onChange={(e) =>
//                     setFormData({ ...formData, year: e.target.value })
//                   }
//                   placeholder="2022"
//                   type="number"
//                   min="1900"
//                   max={new Date().getFullYear() + 1}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="plate">Plate Number *</Label>
//                 <Input
//                   id="plate"
//                   value={formData.plate}
//                   onChange={(e) =>
//                     setFormData({ ...formData, plate: e.target.value })
//                   }
//                   placeholder="ABC123XY"
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="color">Color (Optional)</Label>
//                 <Input
//                   id="color"
//                   value={formData.color}
//                   onChange={(e) =>
//                     setFormData({ ...formData, color: e.target.value })
//                   }
//                   placeholder="Red"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Date & Time Selection */}
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold">Schedule Appointment</h3>

//             <div className="space-y-2">
//               <Label>Select Date *</Label>
//               <Calendar
//                 mode="single"
//                 selected={date}
//                 onSelect={setDate}
//                 disabled={(date) => {
//                   const today = new Date()
//                   today.setHours(0, 0, 0, 0)
//                   return date < today || date.getDay() === 0 // Disable past & Sundays
//                 }}
//                 className="rounded-md border p-3"
//               />
//             </div>

//             {date && (
//               <>
//                 <div className="space-y-2">
//                   <Label>Select Time Slot *</Label>
//                   {availableSlots.length === 0 ? (
//                     <p className="text-sm text-gray-500">
//                       Loading available slots...
//                     </p>
//                   ) : availableSlots.length === 0 ? (
//                     <p className="text-sm text-orange-600">
//                       No slots available on this date
//                     </p>
//                   ) : (
//                     <Select onValueChange={setTimeSlot} value={timeSlot}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Choose a time" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availableSlots.map((slot) => (
//                           <SelectItem key={slot} value={slot}>
//                             {slot}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="pickup"
//                     checked={pickup}
//                     onCheckedChange={(checked) => setPickup(checked as boolean)}
//                   />
//                   <Label htmlFor="pickup" className="cursor-pointer">
//                     I need pickup & drop-off service (+₦5,000)
//                   </Label>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Order Summary */}
//           <Card className="p-6 text-gray-200 border-blue-200">
//             <h3 className="text-lg font-bold mb-4">Order Summary</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Service:</span>
//                 <span className="font-medium">{selectedService.name}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Total Amount:</span>
//                 <span className="font-bold">
//                   ₦{selectedService.price.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Required Deposit (50%):</span>
//                 <span className="font-bold text-blue-700">
//                   ₦{(selectedService.price * 0.5).toLocaleString()}
//                 </span>
//               </div>
//               {pickup && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Pickup & Drop-off:</span>
//                   <span className="font-medium">+₦5,000</span>
//                 </div>
//               )}
//               <div className="pt-2 mt-2 border-t">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>To Pay Now:</span>
//                   <span>₦{depositAmount.toLocaleString()}</span>
//                 </div>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Remaining ₦
//                   {(selectedService.price - depositAmount).toLocaleString()} to
//                   be paid on service completion
//                 </p>
//               </div>
//             </div>
//           </Card>

//           {/* Action Buttons */}
//           <div className="flex gap-4 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => setStep(1)}
//               className="flex-1"
//             >
//               Back to Services
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               disabled={loading || !date || !timeSlot}
//               className="flex-1 bg-blue-600 hover:bg-blue-700"
//               size="lg"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 `Pay ₦${depositAmount.toLocaleString()} Deposit`
//               )}
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




// components/BookingForm.tsx
"use client"

import { useState, useEffect } from "react"
import { format, addMinutes } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Import Sonner toast directly
import { toast } from "sonner"

type Service = {
  id: number
  name: string
  description: string | null
  price: number
  duration: number
  active: boolean
}

export function BookingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState("")
  const [pickup, setPickup] = useState(false)
  const [notes, setNotes] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    plate: "",
    color: "",
  })

  // Fetch services on mount
  useEffect(() => {
    fetchServices()
  }, [])

  // Fetch available slots when date changes
  useEffect(() => {
    if (date) {
      fetchAvailableSlots()
    }
  }, [date])

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services")
      if (res.ok) {
        const data = await res.json()
        setServices(data)
      } else {
        toast.error("Failed to load services")
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      toast.error("Network error – please try again")
    }
  }

  const fetchAvailableSlots = async () => {
    if (!date) return

    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const res = await fetch(`/api/booking?date=${formattedDate}`)
      if (res.ok) {
        const data = await res.json()
        // Expecting { availableSlots: ["09:00", "10:00", ...] }
        setAvailableSlots(data.availableSlots || [])
      } else {
        toast.error("Failed to load available slots")
      }
    } catch (error) {
      console.error("Error fetching slots:", error)
      toast.error("Network error")
    }
  }

  const calculateTimeSlot = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)

    const endDate = addMinutes(startDate, duration)
    const endTime = format(endDate, "HH:mm")

    return `${startTime}-${endTime}`
  }

  const handleSubmit = async () => {
    if (!selectedService || !date || !timeSlot) {
      toast.error("Please complete all required fields")
      return
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'make', 'model', 'year', 'plate'];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return
      }
    }

    const year = parseInt(formData.year)
    if (
      isNaN(year) ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    ) {
      toast.error("Please enter a valid vehicle year")
      return
    }

    setLoading(true)

    const loadingToast = toast.loading("Creating your booking...")

    try {
      const calculatedTimeSlot = calculateTimeSlot(timeSlot, selectedService.duration)

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          date: date.toISOString(),
          timeSlot: calculatedTimeSlot,
          pickupDropoff: pickup,
          notes: notes.trim() || undefined,
          customer: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
          },
          vehicle: {
            make: formData.make.trim(),
            model: formData.model.trim(),
            year,
            plate: formData.plate.trim().toUpperCase(),
            color: formData.color?.trim() || undefined,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Booking failed")
      }

      toast.dismiss(loadingToast)
      toast.success("Booking created successfully!")

      // Redirect to success page with booking ID
      if (data.booking_id) {
        setTimeout(() => {
          router.push(`/booking/success?booking_id=${data.booking_id}`)
        }, 1000)
      } else {
        toast.error("Booking created but no ID returned")
      }
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`ml-2 text-sm ${step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Select Service
          </div>
        </div>
        <div className="flex-1 h-0.5 mx-4 bg-gray-200"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`ml-2 text-sm ${step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Details & Schedule
          </div>
        </div>
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">Select a Service</h2>
            <p className="text-gray-600">
              Choose from our professional detailing services
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services
                .filter((s) => s.active)
                .map((service) => (
                  <Card
                    key={service.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
                      selectedService?.id === service.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => {
                      setSelectedService(service)
                      setStep(2)
                    }}
                  >
                    <h3 className="font-bold text-xl mb-3">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {service.description}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₦{Number(service.price).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {Math.floor(service.duration / 60)}h{" "}
                          {service.duration % 60}m
                        </span>
                      </div>
                    </div>
                    <Button className="w-full mt-6" variant={selectedService?.id === service.id ? "default" : "outline"}>
                      {selectedService?.id === service.id ? "Selected" : "Select Service"}
                    </Button>
                  </Card>
                ))}
            </div>
          )}

          <div className="text-center text-sm text-gray-500 pt-4">
            <p>No deposit required. Pay when you arrive at our shop.</p>
          </div>
        </div>
      )}

      {/* Step 2: Details & Scheduling */}
      {step === 2 && selectedService && (
        <div className="space-y-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
              <p className="text-gray-600">
                Fill in your details and schedule your appointment
              </p>
            </div>
          </div>

          {/* Service Summary Card */}
          <Card className="p-6 border-blue-100 bg-blue-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg mb-1">{selectedService.name}</h3>
                {selectedService.description && (
                  <p className="text-sm text-gray-600">{selectedService.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  ₦{Number(selectedService.price).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.floor(selectedService.duration / 60)}h {selectedService.duration % 60}m duration
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="08012345678"
                    required
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Vehicle Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="make" className="font-medium">Make *</Label>
                  <Input
                    id="make"
                    value={formData.make}
                    onChange={(e) =>
                      setFormData({ ...formData, make: e.target.value })
                    }
                    placeholder="Toyota"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="font-medium">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    placeholder="Camry"
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="font-medium">Year *</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                    placeholder="2022"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    required
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plate" className="font-medium">Plate Number *</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) =>
                      setFormData({ ...formData, plate: e.target.value })
                    }
                    placeholder="ABC123XY"
                    required
                    className="h-12 uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="font-medium">Color (Optional)</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="Red"
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Schedule Appointment</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium block mb-3">Select Date *</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today || date.getDay() === 0 // Disable past & Sundays
                      }}
                      className="rounded-lg border p-4"
                      classNames={{
                        day_selected: "bg-blue-600 text-white hover:bg-blue-700",
                        day_today: "bg-gray-100 text-gray-900",
                      }}
                    />
                    {date && (
                      <p className="text-sm text-gray-600 mt-3">
                        Selected: <span className="font-medium">{format(date, "EEEE, MMMM do, yyyy")}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {date && (
                    <>
                      <div className="space-y-2">
                        <Label className="font-medium">Select Time Slot *</Label>
                        {availableSlots.length === 0 ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            <p className="text-sm text-gray-500 mt-2">Loading available slots...</p>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-orange-700 text-center">
                              No slots available on this date. Please select another date.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setTimeSlot(slot)}
                                className={`py-3 px-4 rounded-lg border text-center transition-all ${
                                  timeSlot === slot
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {timeSlot && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 font-medium">
                            Selected time: <span className="font-bold">{timeSlot}</span>
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            Service will end at approximately{" "}
                            {calculateTimeSlot(timeSlot, selectedService.duration).split("-")[1]}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="pickup"
                        checked={pickup}
                        onCheckedChange={(checked) => setPickup(checked as boolean)}
                        className="h-5 w-5"
                      />
                      <div>
                        <Label htmlFor="pickup" className="font-medium cursor-pointer">
                          I need pickup & drop-off service
                        </Label>
                        <p className="text-sm text-gray-600">
                          Our driver will pick up and return your vehicle (+₦5,000)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="font-medium">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests or instructions..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Updated */}
            <Card className="p-6 border-green-100 bg-green-50">
              <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Service:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₦{Number(selectedService.price).toLocaleString()}
                  </span>
                </div>
                {pickup && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pickup & Drop-off:</span>
                    <span className="font-medium">+₦5,000</span>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg text-green-700">Pay On Arrival</div>
                      <p className="text-sm text-gray-600">
                        No deposit required. Pay when you arrive at our shop.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        ₦{Number(selectedService.price + (pickup ? 5000 : 0)).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total to pay</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Important Information */}
            <Card className="p-6 border-yellow-100 bg-yellow-50">
              <h3 className="font-bold text-lg mb-3 text-yellow-800">📋 Important Information</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>No payment required now</strong> - Pay when you arrive at our shop</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Please arrive 10-15 minutes before your scheduled appointment</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Bring a valid ID for verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Remove all personal belongings from your vehicle before service</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contact us at least 24 hours in advance if you need to reschedule</span>
                </li>
              </ul>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-14 text-lg"
                size="lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !date || !timeSlot || !formData.name || !formData.email || !formData.phone || !formData.make || !formData.model || !formData.year || !formData.plate}
                className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
              <p>By clicking "Confirm Booking", you agree to our terms and conditions.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}