import { describe, it, beforeEach, afterEach, expect, jest } from "@jest/globals";
import * as db from "../../src/Drizzle/db"
import { bookingsTable, TIBooking } from "../../src/Drizzle/schema";
import { createBookingService, getAllBookingsService } from "../../src/bookings/booking.service"

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

  
  
})
