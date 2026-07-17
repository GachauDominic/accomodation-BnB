import { describe, it, beforeEach, afterEach, expect, jest } from "@jest/globals";
import * as db from "../../src/Drizzle/db"
import { bookingsTable, guestsTable, TIBooking } from "../../src/Drizzle/schema";
import { createBookingService, deleteBookingService, getAllBookingsService, getBookingByGuestIdService, getBookingByIdService, updateBookingService } from "../../src/bookings/booking.service"
import { except } from "drizzle-orm/gel-core";

const valueBookingMock = {
  "bookingId": "b4098ec1-5775-48b2-8a42-a998d2e6c18a",
  "bookingRoomNumber": "5A",
  "bookingGuestId": "e04778ee-d2cf-4cb2-9e21-c16b621bfb10",
  "checkinDate": "2026-07-16T00:00:00.000Z",
  "checkoutDate": "2026-07-18T00:00:00.000Z",
  "guestCount": 1,
  "totalAmount": "4500.00",
  "bookingStatus": "assigned",
  "bookingDate": "2026-07-16T13:05:21.550Z"
}

jest.mock("../../src/Drizzle/db", ()=>{
  const dbMock = {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      bookingsTable: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  }

  return {
    __esModule: true,
    default: dbMock,
    ...dbMock,
  }
})


describe("roomServices", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  });

  afterEach(()=>{
    jest.clearAllMocks()
  });

  describe.skip("createBookingService", ()=>{
    it("should create a new room and return a message", async () => {
      const newBookingMock: TIBooking = {
      "bookingRoomNumber": "4A",
      "bookingGuestId": "0417137b-aa06-49c8-a675-b3f6f3290a46",
      "checkinDate": new Date("2026-07-16T00:00:00.000Z"),
      "checkoutDate": new Date("2026-07-18T00:00:00.000Z"),
      "guestCount": 1,
      "totalAmount": "4500.00",
      "bookingStatus": "assigned"
      }

      const returningMock = jest.fn().mockResolvedValue(valueBookingMock)
      const retunValueMock = jest.fn().mockReturnValue({returning: returningMock})
      ;(db.insert as jest.Mock).mockReturnValue({values: retunValueMock})

      const result = await createBookingService(newBookingMock)
      expect(db.insert).toHaveBeenCalledWith(bookingsTable)
      expect(retunValueMock).toHaveBeenCalledWith(newBookingMock)
      expect(returningMock).toHaveBeenCalled()
      expect(result).toEqual(valueBookingMock)
    })

    // retun nullon creation error
    it("should return null if not created", async () => {
      const returningMock = jest.fn().mockResolvedValue(null)
      const returnValueMock = jest.fn().mockReturnValue({returning: returningMock})
      ;(db.insert as jest.Mock).mockReturnValue({values: returnValueMock})

      const result = await createBookingService()
      expect(db.insert).toHaveBeenCalledWith(bookingsTable)
      expect(returnValueMock).toHaveBeenCalled()
      expect(returningMock).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe.skip("getAllBookingsService", ()=>{
    it("should return all bookings", async () => {
      const allBookingsMock = [
        {
          "bookingId": "b4098ec1-5775-48b2-8a42-a998d2etrr",
          "bookingRoomNumber": "5A",
          "bookingGuestId": "e04778ee-d2cf-4cb2-78-99",
          "checkinDate": "2026-07-16T00:00:00.000Z",
          "checkoutDate": "2026-07-18T00:00:00.000Z",
          "guestCount": 2,
          "totalAmount": "4500.00",
          "bookingStatus": "assigned",
          "bookingDate": "2026-07-16T13:05:21.550Z"
        },
        valueBookingMock,
      ]
      // const returnValueMock = jest.fn().mockResolvedValue(allBookingsMock) get a;;does not require this line
      ;(db.query.bookingsTable.findMany as jest.Mock).mockReturnValueOnce(allBookingsMock) // get all such as this is a mockReturnValueOnce

      const result = await getAllBookingsService()
      expect(db.query.bookingsTable.findMany).toHaveBeenCalled()
      // expect(returnValueMock).toHaveBeenCalledWith()
      expect(result).toEqual(allBookingsMock)
    })

    // retun empty array if no bookings 
    it("should retun empty array if not found", async () => {
      ;(db.query.bookingsTable.findMany as jest.Mock).mockReturnValueOnce([])

      const result = await getAllBookingsService()
      expect(db.query.bookingsTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe.skip("getBookingByIdService", ()=>{
    it("get a booking by its id", async () => {
      const bookingId = "a998d2e6c18a"
      const bookingMock = {
        "bookingId": "a998d2e6c18a",
        "bookingRoomNumber": "5A",
        "bookingGuestId": "e04778ee-d2cf-4cb2-9e21-c16b621bfb10",
        "checkinDate": "2026-07-16T00:00:00.000Z",
        "checkoutDate": "2026-07-18T00:00:00.000Z",
        "guestCount": 1,
        "totalAmount": "4500.00",
        "bookingStatus": "assigned",
        "bookingDate": "2026-07-16T13:05:21.550Z"
      }
      ;(db.query.bookingsTable.findFirst as jest.Mock).mockResolvedValue(bookingMock)

      const result = await getBookingByIdService(bookingId)
      expect(db.query.bookingsTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBe(bookingMock)
    })

    // 
    it("should return null if not found", async () => {
      ;(db.query.bookingsTable.findFirst as jest.Mock).mockResolvedValue(undefined)

      const result = await getBookingByIdService()
      expect(db.query.bookingsTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything()
        })
      )
      expect(result).toBeUndefined()
    });


  })
  
  describe.skip("getBookingByGuestIdService", ()=>{
    it("should return a booking by guestid", async () => {
      const guestId = "hjjd0hjd-dj"
      const resultMock = [{
        bookingId: "a998d2e6c18a",
        bookingRoomNumber: "5A",
        totalAmount: "4500.00",
        bookingStatus: "assigned",
        guestId: "dct-oijoi",
        guestContact: "074567097"
      }]
      const whereMock = jest.fn().mockResolvedValue([resultMock])
      const leftJoinMock = jest.fn().mockReturnValue({where: whereMock})
      const fromMock = jest.fn().mockReturnValue({leftJoin: leftJoinMock})
      ;(db.select as jest.Mock).mockReturnValue({from: fromMock})

      const result = await getBookingByGuestIdService(guestId)
      expect(db.select).toHaveBeenCalledWith(
        {bookingId: bookingsTable.bookingId,
        bookingRoomNumber: bookingsTable.bookingRoomNumber,
        totalAmount: bookingsTable.totalAmount,
        bookingStatus: bookingsTable.bookingStatus,
        guestId: guestsTable.guestId,
        guestContact: guestsTable.guestContact}
      )
      expect(fromMock).toHaveBeenCalledWith(bookingsTable)
      expect(leftJoinMock).toHaveBeenCalledWith(guestsTable, expect.anything())
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(resultMock)
    })

    it("should return null if no found", async () => {
      const guestId = "hjjd0hjd-dj"
      const whereMock = jest.fn().mockResolvedValue([])
      const leftJoinMock = jest.fn().mockReturnValue({where: whereMock})
      const fromMock = jest.fn().mockReturnValue({leftJoin: leftJoinMock})
      ;(db.select as jest.Mock).mockReturnValue({from: fromMock})

      const result = await getBookingByGuestIdService(guestId)
      expect(db.select).toHaveBeenCalledWith(
        {bookingId: bookingsTable.bookingId,
        bookingRoomNumber: bookingsTable.bookingRoomNumber,
        totalAmount: bookingsTable.totalAmount,
        bookingStatus: bookingsTable.bookingStatus,
        guestId: guestsTable.guestId,
        guestContact: guestsTable.guestContact}
      )
      expect(fromMock).toHaveBeenCalledWith(bookingsTable)
      expect(leftJoinMock).toHaveBeenCalledWith(guestsTable, expect.anything())
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(result).toBeUndefined()
    })
  })

  describe.skip("updateBookingService", ()=>{
    it("should update a booking nd retutn it", async () => {
      const updateMock: TIBooking = {
        "bookingStatus": "vacant"
      }
      const newValueMock = {
        "bookingId": "806",
        "bookingRoomNumber": "4A",
        "bookingGuestId": "0417137b-aa06-49c8-a675-b3f6f3290a46",
        "checkinDate": "2026-07-16T00:00:00.000Z",
        "checkoutDate": "2026-07-18T00:00:00.000Z",
        "guestCount": 1,
        "totalAmount": "4500.00",
        "bookingStatus": "vacant",
        "bookingDate": "2026-07-16T13:11:00.235Z"
      }

      // const returnValueMock = jest.fn().mockResolvedValue(newValueMock)
      const returningMock = jest.fn().mockResolvedValue([newValueMock])
      const whereMock = jest.fn().mockReturnValue({returning: returningMock})
      const setMock = jest.fn().mockReturnThis()
      ;(db.update as jest.Mock).mockReturnValue(
        {set: setMock,
        where: whereMock,
        returning: returningMock}
      )

      const result = await updateBookingService("806", updateMock);
      expect(db.update).toHaveBeenCalledWith(bookingsTable)
      expect(setMock).toHaveBeenCalled()
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(returningMock).toHaveBeenCalled()
      expect(result).toEqual([newValueMock])
    })

    // return null || undefined
    it("should return null if not found", async () => {
      const returningMock = jest.fn().mockResolvedValue(undefined)
      const whereMock = jest.fn().mockReturnValue({returning: returningMock})
      const setMock = jest.fn().mockReturnThis()
      ;(db.update as jest.Mock).mockReturnValue(
        {set: setMock,
        where: whereMock,
        returning: returningMock}
      )

      const result = await updateBookingService();
      expect(db.update).toHaveBeenCalledWith(bookingsTable)
      expect(setMock).toHaveBeenCalled()
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(returningMock).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
  
  describe.skip("deleteBookingService", ()=>{
    it("should delete a booking and return a message", async () => {
      const bookingId = "798";
      
      // note there ia a returning mock since the actual service itself doesn't and thus the where clause is undefined
      const whereMock = jest.fn().mockResolvedValue(undefined); // Must be awaitable
      (db.delete as jest.Mock).mockReturnValue({
        where: whereMock,
      });
  
      const result = await deleteBookingService(bookingId);
  
      expect(db.delete).toHaveBeenCalledWith(bookingsTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual("Booking deleted successfully");
    })
  })

})
