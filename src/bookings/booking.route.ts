import { Express } from "express";
import { createBokingController, deleteBookingController, getAllBookingsController, getBookingByGuestIdController, getBookingByIdController, updateBookingController } from "./booking.controller";
import { adminRoleAuth, bothRoleAuth } from "../middleware/bearAuth";

const bookings = (app: Express)=>{
  // create booking
  app.route("/booking").post(
    // bothRoleAuth,
    async (req, res, next) => {
    try {
      await createBokingController(req, res)
    } catch (error) {
      next(error)
    }
  }); 

  // get all bookings
  app.route("/auth/bookings").get(
    // adminRoleAuth,
    async (req, res, next) => {
    try {
      await getAllBookingsController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get booking by id
  app.route("/auth/bookings/bookingbyid/:bookingId").get(
    // bothRoleAuth,
    async (req, res , next) => {
    try {
      await getBookingByIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // get booking by guest id
  app.route("/auth/bookings/bookingbyguestid/:guestId").get(
    // bothRoleAuth,
    async (req, res , next) => {
    try {
      await getBookingByGuestIdController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // update booking by its id
  app.route("/auth/bookings/updatebyid/:bookingId").patch(
    // bothRoleAuth,
    async (req, res, next) => {
    try {
      await updateBookingController(req, res)
    } catch (error) {
      next(error)
    }
  });

  // delete booking by id
  app.route("/auth/bookings/deletebyid/:bookingId").delete(
    // bothRoleAuth,
    async (req, res, next) => {
    try {
      await deleteBookingController(req, res)
    } catch (error) {
      next(error)
    }
  });
}
export default bookings;