// types/booking.ts  (create this file if you don't have one)
export interface Booking {
  id: number;
  date: string;                    // ← string, not String
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string | null;
  amountPaid: number | null;       // after transformation
  paymentDate?: string | null;     // ISO string or formatted
  paymentMethod?: string | null;
  paymentNotes?: string | null;
  createdAt: string;               // ISO string
  updatedAt: string;

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  vehicle: {
    make: string;
    model: string;
    year: number;
    plate: string;
    color?: string | null;
  };

  service: {
    name: string;
    price: number;                 // after Number(decimal)
    duration: number;
    // you can keep other fields if needed
  };
}