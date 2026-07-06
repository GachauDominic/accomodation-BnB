import { Request, Response } from "express";
import { createBookingService, deleteBookingService, getAllBookingsService, getBookingByGuestIdService, getBookingByIdService, updateBookingService } from "./booking.service";
import { getGuestByIdService } from "../guests/guest.service";

// create booking
export const createBokingController = async (req: Request, res: Response) => {
  try {
    const booking = req.body
    if (booking.checkinDate && booking.checkoutDate) {
      booking.checkinDate = new Date(booking.checkinDate)
      booking.checkoutDate = new Date(booking.checkoutDate)
    }
    const createdBooking = await createBookingService(booking)
    if(!createdBooking) return res.json({message: "Booking not created"})
      return res.status(201).json({message: "Booking created", data: createdBooking})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
}; 

// get all booking
export const getAllBookingsController = async (req: Request, res: Response) => {
 try {
   const bookings = await getAllBookingsService()
   if(!bookings || bookings.length===0) return res.status(404).json({message: "No available bookings"})
    return res.status(200).json({data: bookings})
 } catch (error: any) {
  return res.status(500).json({error: error.message})
 }
};

// get booking by Id
export const getBookingByIdController = async (req: Request, res: Response) => {
 try {
    const bookingId = req.params.bookingId ?? req.body.bookingId
    if (!bookingId) {
      return res.json({message: "Booking Id is required"})
    }

    const booking = await getBookingByIdService(bookingId)
    if (!booking) return res.status(404).json({message: "Booking not found"})
      return res.status(200).json({data: booking})
 } catch (error: any) {
    return res.status(500).json({error: error.message})
 }
};

// get booking by guest id
export const getBookingByGuestIdController = async (req: Request, res: Response) => {
  try {
    const guestId = req.params.guestId ?? req.body.guestId
    if (!guestId) {
      return res.json({message: "Guest Id is required"})
    }

    const ifExistingGuest = await getGuestByIdService(guestId)
    if (!ifExistingGuest) {
      return res.status(404).json({message: "Guest not available"})
    }

    const booking = await getBookingByGuestIdService(guestId)
    if (!booking) {
      return res.status(404).json({message: "Booking not Found!"})
    }
    return res.status(200).json({data: booking})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// update booking
export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId ?? req.body.bookingId
    if (!bookingId) return res.json({message: "Booking Id required"})

    const bookings = req.body
    //convert checkindate & checkoutdate & bookingdate to a Date Object if provided
    if (bookings.checkinDate && bookings.checkoutDate && bookings.bookingDate) {
      bookings.checkinDate = new Date(bookings.checkinDate)
      bookings.checkoutDate = new Date(bookings.checkoutDate)
      bookings.bookingDate = new Date(bookings.bookingDate)
    }
    
    const ifBookingExist = await getBookingByIdService(bookingId)
    if (!ifBookingExist) return res.status(404).json({message: "Booking not found"})

    const updatedbooking = await updateBookingService(bookingId, bookings)
    if (!updatedbooking) return res.status(400).json({message: "Unable to update booking"})
      return res.status(200).json({ message: "Booking updated successfully", data: updatedbooking })
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};

// delete a booking
export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId ?? req.body.bookingId
      if (!bookingId) {
        return res.status(400).json({message: "Booking id is required"})      
      }

      // const updateData = req.body
      const ifExistingBooking = await getBookingByIdService(bookingId)
      if (!ifExistingBooking) return res.status(404).json({message: "Booking not found!"})
    
    const deletedBooking = await deleteBookingService(bookingId)
    if (!deletedBooking) return res.status(400).json({message: "Unable to delete Booking"})
      return res.status(200).json({message: "Booking deleted successfuly"})
  } catch (error: any) {
    return res.status(500).json({error: error.message})
  }
};
