
import {
  createBokingController,
  deleteBookingController,
  getAllBookingsController,
  getBookingByGuestIdController,
  getBookingByIdController,
  updateBookingController,
} from "../../src/bookings/booking.controller";

jest.mock("../../src/bookings/booking.service", () => ({
  createBookingService: jest.fn(),
  getAllBookingsService: jest.fn(),
  getBookingByGuestIdService: jest.fn(),
  getBookingByIdService: jest.fn(),
  updateBookingService: jest.fn(),
  deleteBookingService: jest.fn(),
}));

jest.mock("../../src/guests/guest.service", () => ({
  getGuestByIdService: jest.fn(),
}));

const guestService = require("../../src/guests/guest.service");
const bookingService = require("../../src/bookings/booking.service");

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Bookings controller (mocked integration tests)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("createBokingController returns 201 and created booking data", async () => {
    const mockBooking = {
      bookingRoomNumber: "1A",
      bookingGuestId: "g1",
      checkinDate: "2026-07-16",
      checkoutDate: "2026-07-18",
      guestCount: 1,
      totalAmount: "4500.00",
      bookingStatus: "assigned",
    };

    const createdBooking = { ...mockBooking, bookingId: "b1", bookingDate: "2026-08-10" };
    bookingService.createBookingService.mockResolvedValue(createdBooking);

    const req: any = { body: mockBooking };
    const res = mockResponse();

    await createBokingController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Booking created",
      data: createdBooking,
    });
  });

  it("getAllBookingsController returns 200 with all bookings", async () => {
    const bookings = [{ bookingId: "b1", bookingRoomNumber: "1A" }];
    bookingService.getAllBookingsService.mockResolvedValue(bookings);

    const req: any = {};
    const res = mockResponse();

    await getAllBookingsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: bookings });
  });

  it("getAllBookingsController returns 404 if no bookings", async () => {
    const req: any = {};
    const res = mockResponse();

    await getAllBookingsController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "No available bookings"});
    
  });

  it("getBookingByIdController returns 200 when booking exists", async () => {
    const booking = { bookingId: "b1", bookingRoomNumber: "1A" };
    bookingService.getBookingByIdService.mockResolvedValue(booking);

    const req: any = { params: { bookingId: "b1" } };
    const res = mockResponse();

    await getBookingByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: booking });
  });

  it("getBookingByIdController returns 400 if bookingId is not provided", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await getBookingByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "Booking Id is required"});
    
  });

  it("getBookingByIdController returns 404 if no booking with that bookingId", async () => {
    const req: any = { params: { bookingId: "b1" } };
    const res = mockResponse();

    await getBookingByIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "Booking not found"});
    
  });

  it("getBookingByGuestIdController returns 200 when guest exists and booking found", async () => {
    const booking = [{ bookingId: "b1", bookingGuestId: "g1" }];
    guestService.getGuestByIdService.mockResolvedValue({ guestId: "g1" });
    bookingService.getBookingByGuestIdService.mockResolvedValue(booking);

    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await getBookingByGuestIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: booking });
  });

  it("getBookingByGuestIdController returns 400 when guestId is not provided", async () => {
    const req: any = { params: {}, body: {}};
    const res = mockResponse();

    await getBookingByGuestIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith( {message: "Guest Id is required"} );
  });

  it("getBookingByGuestIdController returns 404 when guest does not exist", async () => {
    const req: any = { params: { guestId: "g1" } };
    const res = mockResponse();

    await getBookingByGuestIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Guest not available" });
  });

  it("updateBookingController returns 200 when booking is updated", async () => {
    const updatedBooking = { bookingId: "b1", bookingStatus: "assigned" };
    bookingService.getBookingByIdService.mockResolvedValue({ bookingId: "b1" });
    bookingService.updateBookingService.mockResolvedValue(updatedBooking);

    const req: any = {
      params: { bookingId: "b1" },
      body: { bookingStatus: "assigned" },
    };
    const res = mockResponse();

    await updateBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  }); 
  
  it("updateBookingController returns 400 when booking is not provided", async () => {
    const req: any = {
      params: {},
      body: {},
    };
    const res = mockResponse();

    await updateBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith( { "message": "Booking Id required"  });
  });

  it("updateBookingController returns 404 when booking is does not exist/not found", async () => {
    const req: any = {
      params: { bookingId: "b1" },
      body: { bookingStatus: "assigned" },
    };
    const res = mockResponse();

    await updateBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Booking not found", });
  });

  it("deleteBookingController returns 204 when booking is deleted", async () => {
    bookingService.getBookingByIdService.mockResolvedValue({ bookingId: "b1" });
    bookingService.deleteBookingService.mockResolvedValue("Booking deleted");

    const req: any = { params: { bookingId: "b1" } };
    const res = mockResponse();

    await deleteBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: "Booking deleted successfuly" });
  });

  it("deleteBookingController returns 400 when bookingId is not provoded", async () => {
    const req: any = { params: {}, body: {} };
    const res = mockResponse();

    await deleteBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Booking id is required" });
  });

  it("deleteBookingController returns 404 when booking is not found/does not exist", async () => {
    const req: any = { params: { bookingId: "b1" } };
    const res = mockResponse();

    await deleteBookingController(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Booking not found!" });
  });

});