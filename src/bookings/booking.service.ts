import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { bookingsTable, guestsTable, TIBooking, TIRoom} from "../Drizzle/schema";
import bookings from "./booking.route";

// create a booking
export const createBookingService = async (booking: TIBooking) => {
  await db.insert(bookingsTable).values(booking)
  return "Booking created"
};

// get all bookings
export const getAllBookingsService = async () => {
  const bookings = await db.query.bookingsTable.findMany()
  return bookings
};

// get booking by booking id
export const getBookingByIdService = async (bookingId:string) => {
  const booking = await db.query.bookingsTable.findFirst({where: eq(bookingsTable.bookingId, bookingId)})
  return booking
};

// get booking by guest id
export const getBookingByGuestIdService = async (guestId:string) => {
  const [booking] = await db.select({
    bookingId: bookingsTable.bookingId,
    bookingRoomNumber: bookingsTable.bookingRoomNumber,
    totalAmount: bookingsTable.totalAmount,
    bookingStatus: bookingsTable.bookingStatus,
    guestId: guestsTable.guestId,
    guestContact: guestsTable.guestContact
  })
  .from(bookingsTable)
  .leftJoin(guestsTable, eq(bookingsTable.bookingGuestId, guestsTable.guestId))
  .where(eq(guestsTable.guestId, guestId))
  return booking
};

// update a booking by booking id
export const updateBookingService = async (bookingId:string, updateBooking: Partial<TIBooking>) => {
  const updatedBooking = await db.update(bookingsTable)
  .set(updateBooking)
  .where(eq(bookingsTable.bookingId, bookingId))
  .returning()
  return updatedBooking
};

// delete a booking by booking id
export const deleteBookingService = async (bookingId:string) => {
  await db.delete(bookingsTable).where(eq(bookingsTable.bookingId, bookingId))
  return "Booking deleted successfully"
};