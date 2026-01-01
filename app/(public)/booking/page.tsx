// // src/app/(public)/book/page.tsx
// import { BookingForm } from "@/components/BookingForm"
// import { Shield, Clock, CreditCard } from "lucide-react"

// export default function BookPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Book Your Auto Detailing Service
//           </h1>
//           <p className="text-lg text-gray-600">
//             Professional detailing services with 50% deposit to secure your booking
//           </p>
//         </div>

//         {/* Features */}
//         <div className="grid md:grid-cols-3 gap-6 mb-12">
//           <div className="text-center p-6 bg-white rounded-xl shadow-sm">
//             <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Shield className="h-6 w-6 text-blue-600" />
//             </div>
//             <h3 className="font-bold text-lg mb-2">Secure Booking</h3>
//             <p className="text-gray-600">Pay 50% deposit to secure your slot</p>
//           </div>
//           <div className="text-center p-6 bg-white rounded-xl shadow-sm">
//             <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Clock className="h-6 w-6 text-blue-600" />
//             </div>
//             <h3 className="font-bold text-lg mb-2">Flexible Scheduling</h3>
//             <p className="text-gray-600">Choose date & time that works for you</p>
//           </div>
//           <div className="text-center p-6 bg-white rounded-xl shadow-sm">
//             <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CreditCard className="h-6 w-6 text-blue-600" />
//             </div>
//             <h3 className="font-bold text-lg mb-2">Easy Payment</h3>
//             <p className="text-gray-600">Pay with Paystack securely</p>
//           </div>
//         </div>

//         {/* Booking Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <BookingForm />
//         </div>

//         {/* FAQ */}
//         <div className="mt-12">
//           <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
//           <div className="space-y-4">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="font-bold mb-2">How does the deposit work?</h3>
//               <p className="text-gray-600">Pay 50% deposit to secure your booking. The remaining balance is paid when service is completed.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="font-bold mb-2">Can I reschedule my appointment?</h3>
//               <p className="text-gray-600">Yes, you can reschedule up to 24 hours before your appointment by contacting us.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="font-bold mb-2">What payment methods do you accept?</h3>
//               <p className="text-gray-600">We accept all major cards, bank transfers, and mobile money through Paystack.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }




// src/app/(public)/book/page.tsx
import { BookingForm } from "@/components/BookingForm"
import { Shield, Clock, CreditCard, CheckCircle, Calendar, Headphones } from "lucide-react"

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-gold-subtle rounded-full border border-primary/20">
            <Calendar className="h-4 w-4 text-foreground" />
            <span className="text-sm font-bold">Easy Booking</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient-gold">Schedule Your</span>
            <br />
            <span className="text-foreground">Premium Service</span>
          </h1>
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto font-semibold">
            Secure your appointment with a 50% deposit. Experience professional detailing with care.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="glass p-8 rounded-2xl border border-contrast shadow-soft transition-all duration-300 hover:shadow-gold hover:border-primary/30">
            <div className="bg-gradient-gold w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-gold">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-3 font-bebas tracking-wider text-foreground">Secure Booking</h3>
            <p className="text-foreground/80 font-semibold">50% deposit reserves your exclusive time slot with full protection</p>
          </div>
          
          <div className="glass p-8 rounded-2xl border border-contrast shadow-soft transition-all duration-300 hover:shadow-gold hover:border-primary/30">
            <div className="bg-gradient-gold w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-gold">
              <Clock className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-3 font-bebas tracking-wider text-foreground">Flexible Times</h3>
            <p className="text-foreground/80 font-semibold">Choose from available slots that fit your busy schedule perfectly</p>
          </div>
          
          <div className="glass p-8 rounded-2xl border border-contrast shadow-soft transition-all duration-300 hover:shadow-gold hover:border-primary/30">
            <div className="bg-gradient-gold w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-gold">
              <CreditCard className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-3 font-bebas tracking-wider text-foreground">Secure Payment</h3>
            <p className="text-foreground/80 font-semibold">Industry-standard encryption with multiple payment options</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-gradient-card rounded-2xl shadow-elegant p-8 md:p-12 border border-contrast/50 mb-16">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-gold-subtle rounded-full border border-primary/20">
              <CheckCircle className="h-4 w-4 text-foreground" />
              <span className="text-sm font-bold">Quick & Easy</span>
            </div>
            <h2 className="text-4xl font-bebas tracking-wider mb-3 text-foreground">Book Your Appointment</h2>
            <p className="text-foreground/80 font-semibold">Fill in your details below to secure your slot</p>
          </div>
          <BookingForm />
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bebas tracking-wider mb-3 text-foreground">
              Common Questions
            </h2>
            <div className="w-32 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-xl border border-contrast shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-gradient-gold rounded-full"></div>
                How does the deposit work?
              </h3>
              <p className="text-foreground/80 font-semibold pl-5">
                Secure your booking with a 50% deposit. Pay the remaining balance when service is completed.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl border border-contrast shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-gradient-gold rounded-full"></div>
                Can I reschedule?
              </h3>
              <p className="text-foreground/80 font-semibold pl-5">
                Yes! Reschedule up to 24 hours before your appointment at no additional charge.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl border border-contrast shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-gradient-gold rounded-full"></div>
                What payment methods?
              </h3>
              <p className="text-foreground/80 font-semibold pl-5">
                All major cards, bank transfers, and mobile money through secure Paystack gateway.
              </p>
            </div>
            
            <div className="glass p-6 rounded-xl border border-contrast shadow-soft">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-3 text-foreground">
                <div className="w-2 h-2 bg-gradient-gold rounded-full"></div>
                What if I need to cancel?
              </h3>
              <p className="text-foreground/80 font-semibold pl-5">
                Cancel 48+ hours in advance for a full refund. Contact us for specific details.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Trust */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-2xl border border-contrast shadow-soft">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center">
                <Headphones className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-foreground">Need Help?</h3>
                <p className="text-foreground/80 font-semibold">Our team is here for you</p>
              </div>
            </div>
            <p className="text-foreground/80 font-semibold">
              Have questions about our services or need assistance with booking? 
              Contact our support team — we're happy to help!
            </p>
          </div>
          
          <div className="glass p-8 rounded-2xl border border-contrast shadow-soft">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-gold w-12 h-12 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-foreground">Secure & Trusted</h3>
                <p className="text-foreground/80 font-semibold">Your safety is our priority</p>
              </div>
            </div>
            <p className="text-foreground/80 font-semibold">
              All payments are encrypted and secure. We never store your payment details. 
              Industry-standard security protocols.
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center glass p-8 rounded-2xl border border-contrast shadow-soft">
          <h3 className="text-2xl font-bebas tracking-wider mb-4 text-foreground">
            Ready for Premium Service?
          </h3>
          <p className="text-foreground/80 font-semibold mb-6 max-w-2xl mx-auto">
            Book your appointment now and experience the difference. Limited slots available for premium detailing.
          </p>
          <div className="text-sm font-bold">
            <span className="text-gradient-gold">✓ Secure</span> • 
            <span className="text-gradient-gold"> ✓ Flexible</span> • 
            <span className="text-gradient-gold"> ✓ Professional</span>
          </div>
        </div>
      </div>
    </div>
  )
}