// src/components/BookingForm.tsx
"use client"

import { useState, useEffect } from "react"
import { format, addMinutes } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

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
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeSlot, setTimeSlot] = useState("")
  const [pickup, setPickup] = useState(false)

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

  const depositAmount = selectedService
    ? selectedService.price * 0.5 + (pickup ? 5000 : 0)
    : 0

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
          depositAmount,
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
      toast.success("Booking created! Redirecting to payment...")

      if (data.authorization_url) {
        window.location.href = data.authorization_url
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
      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Select a Service</h2>
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
            <div className="grid md:grid-cols-2 gap-4">
              {services
                .filter((s) => s.active)
                .map((service) => (
                  <Card
                    key={service.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedService?.id === service.id
                        ? "border-2 border-blue-500 bg-blue-50"
                        : "border hover:border-blue-300"
                    }`}
                    onClick={() => {
                      setSelectedService(service)
                      setStep(2)
                    }}
                  >
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {service.description}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      ₦{service.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Duration: {Math.floor(service.duration / 60)}h{" "}
                      {service.duration % 60}m
                    </p>
                  </Card>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details & Scheduling */}
      {step === 2 && selectedService && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Complete Your Booking</h2>
            <p className="text-gray-600">
              Fill in your details and schedule your appointment
            </p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="08012345678"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData({ ...formData, make: e.target.value })
                  }
                  placeholder="Toyota"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="Camry"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plate">Plate Number *</Label>
                <Input
                  id="plate"
                  value={formData.plate}
                  onChange={(e) =>
                    setFormData({ ...formData, plate: e.target.value })
                  }
                  placeholder="ABC123XY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color (Optional)</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="Red"
                />
              </div>
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Schedule Appointment</h3>

            <div className="space-y-2">
              <Label>Select Date *</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today || date.getDay() === 0 // Disable past & Sundays
                }}
                className="rounded-md border p-3"
              />
            </div>

            {date && (
              <>
                <div className="space-y-2">
                  <Label>Select Time Slot *</Label>
                  {availableSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      Loading available slots...
                    </p>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-orange-600">
                      No slots available on this date
                    </p>
                  ) : (
                    <Select onValueChange={setTimeSlot} value={timeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pickup"
                    checked={pickup}
                    onCheckedChange={(checked) => setPickup(checked as boolean)}
                  />
                  <Label htmlFor="pickup" className="cursor-pointer">
                    I need pickup & drop-off service (+₦5,000)
                  </Label>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <Card className="p-6 text-gray-200 border-blue-200">
            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold">
                  ₦{selectedService.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Required Deposit (50%):</span>
                <span className="font-bold text-blue-700">
                  ₦{(selectedService.price * 0.5).toLocaleString()}
                </span>
              </div>
              {pickup && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup & Drop-off:</span>
                  <span className="font-medium">+₦5,000</span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>To Pay Now:</span>
                  <span>₦{depositAmount.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Remaining ₦
                  {(selectedService.price - depositAmount).toLocaleString()} to
                  be paid on service completion
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back to Services
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !date || !timeSlot}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₦${depositAmount.toLocaleString()} Deposit`
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}