import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { bookingsTable, paymentsTable, TIPayment } from "../Drizzle/schema";

// create payment
export const createPaymentService = async (payment: TIPayment) => {
  const paymentComplete = await db.insert(paymentsTable).values(payment).returning()
  return paymentComplete
};

// get all payments
export const getAllPaymentsService = async () => {
  const payments = await db.query.paymentsTable.findMany()
  return payments
};

// get payment by its ID
export const getPaymentByIdService = async (paymentId: string) => {
  const payment = await db.query.paymentsTable.findFirst({where: eq(paymentsTable.paymentId, paymentId)})
  return payment
};

// get payment by booking id
export const getPaymentByBookingIdService = async (bookingId: string) => {
  const [payment] = await db.select({
    paymentId: paymentsTable.paymentId,
    paymentBookingId: paymentsTable.paymentBookingId,
    paymentMethod: paymentsTable.paymentMethod,
    paymentStatus: paymentsTable.paymentStatus,
    paymentDate: paymentsTable.paymentDate,
  })
  .from(paymentsTable)
  .innerJoin(bookingsTable, eq(paymentsTable.paymentBookingId, bookingsTable.bookingId))
  .where(eq(paymentsTable.paymentBookingId, bookingId))
  return payment
}

// update a payment
export const updatePaymentByIdService = async (paymentId: string, updatePayment:Partial<TIPayment>) => {
  const [updatedPayment] = await db.update(paymentsTable)
  .set(updatePayment)
  .where(eq(paymentsTable.paymentId, paymentId))
  .returning()
  return updatedPayment
};

// delete a payment by its id
export const deletePaymentService = async (paymentId: string) => {
  await db.delete(paymentsTable)
  .where(eq(paymentsTable.paymentId, paymentId))
  return "The payment details was deleted successfully"
}