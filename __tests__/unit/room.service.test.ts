import { describe, it, beforeEach, afterEach, expect, jest } from "@jest/globals";
import * as db from "../../src/Drizzle/db"
import {
  createRoomService,
  deleteRoomService,
  getAllRoomsService,
  getRoomByNumService,
  getOccupiedRoomsService,
  getVacantRoomsService,
  getBookedRoomsService,
  getRoomByGuestService,
  updateRoomService,
} from "../../src/rooms/room.service"
import { bookingsTable, guestsTable, roomsTable } from "../../src/Drizzle/schema";

const mockRoom = {
  "roomNumber": "1A",
  "roomDescription": "Bedsitter: one bathroom, one bed, dinner and breakfast included",
  "address": "Pamki Building, Kimathi way Nyeri down town",
  "maxGuest": 2,
  "pricePerNight": "1500.00",
  "roomStatus": "vacant"
}

const mockSavedRoom = {
  ...mockRoom
}

// {
//   "roomNumber": "2A",
//   "roomDescription": "Bedsitter: one bathroom, dinner and breakfast included",
//   "address": "Pamki Building, Kimathi way Nyeri down town",
//   "maxGuest": 2,
//   "pricePerNight": "1500.00",
//   "roomstatus": "vacant"
// },
// {
//   "roomNumber": "3A",
//   "roomDescription": "One bedroom: one bathroom, one dinning room, dinner and breakfast included",
//   "address": "Pamki Building, Kimathi way Nyeri down town",
//   "maxGuest": 3,
//   "pricePerNight": "2000.00",
//   "roomstatus": "vacant"
// },


jest.mock("../../src/Drizzle/db", ()=>{
  const dbMock = {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      roomsTable: {
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

  // create room
  describe.skip("createRoomService", ()=>{
    it("create a room and have returning promise value", async () => {
      const returningRoomMock = jest.fn().mockResolvedValue([mockSavedRoom])
      const valueRoomMock = jest.fn().mockReturnValue({returning: returningRoomMock});
      (db.insert as jest.Mock).mockReturnValue({ values: valueRoomMock })

      const result = await createRoomService(mockRoom)
      expect(db.insert).toHaveBeenCalledWith(roomsTable)
      expect(valueRoomMock).toHaveBeenCalledWith(mockRoom)
      expect(returningRoomMock).toHaveBeenCalled()
      expect(result).toEqual([mockSavedRoom])
    });

    // return null if not created
    it("should return null if not created", async () => {
      // const mockRoom = {}
      const returningMock = jest.fn().mockResolvedValue(null);
      const valueReturnMock = jest.fn().mockReturnValue({returning: returningMock});
      (db.insert as jest.Mock).mockReturnValue({values: valueReturnMock})

      const result = await createRoomService(mockRoom)
      expect(db.insert).toHaveBeenCalledWith(roomsTable)
      expect(valueReturnMock).toHaveBeenCalledWith(mockRoom)
      expect(returningMock).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  // get all rooms
  describe.skip("getAllRoomsService", ()=>{
    it.skip("should return an array of objects containing rooms data", async () => {
      const mockRooms = [
        mockSavedRoom,
        {
          "roomNumber": "2A",
          "roomDescription": "Bedsitter: one bathroom, dinner and breakfast included",
          "address": "Pamki Building, Kimathi way Nyeri down town",
          "maxGuest": 2,
          "pricePerNight": "1500.00",
          "roomstatus": "vacant"
        },
        {
          "roomNumber": "3A",
          "roomDescription": "One bedroom: one bathroom, one dinning room, dinner and breakfast included",
          "address": "Pamki Building, Kimathi way Nyeri down town",
          "maxGuest": 3,
          "pricePerNight": "2000.00",
          "roomstatus": "vacant"
        },
      ];
      (db.query.roomsTable.findMany as jest.Mock).mockReturnValueOnce(mockRooms)

      const result = await getAllRoomsService(mockRooms)
      expect(db.query.roomsTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(mockRooms)
    });

    // return empty array if  o rooms found
    it("should return empty array if empty", async () => {
      const mockRooms = [];
      (db.query.roomsTable.findMany as jest.Mock).mockReturnValueOnce(mockRooms)
      
      const result = await getAllRoomsService(mockRooms)
      expect(result).toEqual([])
      expect(db.query.roomsTable.findMany).toHaveBeenCalled()
    })
  })

  // get room by num
  describe.skip("getRoomByNumService", ()=>{
    // return the room data 
    it("should get a room by it num", async () => {
      const roomNum = "1A"
      const mockRoom = [{
        "roomNumber": "1A",
        "roomDescription": "Bedsitter: one bathroom, one bed, dinner and breakfast included",
        "address": "Pamki Building, Kimathi way Nyeri down town",
        "maxGuest": 2,
        "pricePerNight": "1500.00"
      }];
      (db.query.roomsTable.findFirst as jest.Mock).mockResolvedValue(mockRoom)

      const result = await getRoomByNumService(roomNum)
      expect(db.query.roomsTable.findFirst).toHaveBeenCalled()
      expect(result).toEqual(mockRoom)
    }),

    // empty room not found
    it("should return empty array if room not found", async () => {
      ;(db.query.roomsTable.findFirst as jest.Mock).mockResolvedValue(undefined)

      const result = await getRoomByNumService("invalid")
      expect(db.query.roomsTable.findFirst).toHaveBeenCalled()
      // expect(result).toBeNull()
      expect(result).toBeUndefined()
    });
  })

  // get occupied rooms
  describe("getOccupiedRoomsService", () => {
    it("should return the all occupied rooms", async () => {
    const occupiedRooms = [
      {
        "roomNumber": "2A",
        "guestId": "guest-1",
      },
      {
        "roomNumber": "3A",
        "guestId": "guest-2",
      },
    ];

    const orderByMock = jest.fn().mockResolvedValue([occupiedRooms]);
    const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock });
    const secondInnerJoinMock = jest.fn().mockReturnValue({
      where: whereMock,
    });
    const firstInnerJoinMock = jest.fn().mockReturnValue({
      innerJoin: secondInnerJoinMock,
    });
    const fromMock = jest.fn().mockReturnValue({
      innerJoin: firstInnerJoinMock,
    });

    (db.select as jest.Mock).mockReturnValue({
      from: fromMock,
    });

    const result = await getOccupiedRoomsService();

    expect(db.select).toHaveBeenCalledWith({
      roomNumber: roomsTable.roomNumber,
      guestId: guestsTable.guestId,
    });
    expect(fromMock).toHaveBeenCalledWith(bookingsTable);
    expect(firstInnerJoinMock).toHaveBeenCalledWith(
      roomsTable,
      expect.anything()
    );
    expect(secondInnerJoinMock).toHaveBeenCalledWith(
      guestsTable,
      expect.anything()
    );
    expect(whereMock).toHaveBeenCalledWith(expect.anything());
    expect(orderByMock).toHaveBeenCalledWith(expect.anything());

    // The service returns only the first element.
    expect(result).toEqual([occupiedRooms][0]);

    // The service returns all occupied rooms
    expect(result).toEqual(occupiedRooms);

  });

    it("should return undefined when no occupied rooms are found", async () => {
      const orderByMock = jest.fn().mockResolvedValue([])
      const whereMock = jest.fn().mockReturnValue({ orderBy: orderByMock })
      const secondInnerJoinMock = jest.fn().mockReturnValue({ where: whereMock })
      const firstInnerJoinMock = jest.fn().mockReturnValue({
        innerJoin: secondInnerJoinMock,
      })
      const fromMock = jest.fn().mockReturnValue({
        innerJoin: firstInnerJoinMock,
      })
      ;(db.select as jest.Mock).mockReturnValue({ from: fromMock })

      const result = await getOccupiedRoomsService()

      expect(db.select).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
  
  // get vacant rooms
  describe.skip("getVacantRoomsService", () => {
    it("should return vacant rooms ordered by room number", async () => {
      const vacantRooms = [
        mockSavedRoom,
        {
          roomNumber: "2A",
          roomDescription: "Bedsitter: one bathroom, dinner and breakfast included",
          address: "Pamki Building, Kimathi way Nyeri down town",
          maxGuest: 2,
          pricePerNight: "1500.00",
          roomstatus: "vacant",
        },
        {
          "roomNumber": "3A",
          "roomDescription": "One bedroom: one bathroom, one dinning room, dinner and breakfast included",
          "address": "Pamki Building, Kimathi way Nyeri down town",
          "maxGuest": 3,
          "pricePerNight": "2000.00",
          "roomstatus": "vacant"
        },
      ]
      ;(db.query.roomsTable.findMany as jest.Mock).mockResolvedValue(vacantRooms)

      const result = await getVacantRoomsService()
      expect(db.query.roomsTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
          orderBy: [expect.anything()],
        })
      )
      expect(result).toEqual(vacantRooms)
    })

    it("should return an empty array when there are no vacant rooms", async () => {
      ;(db.query.roomsTable.findMany as jest.Mock).mockResolvedValue([])

      const result = await getVacantRoomsService()

      expect(db.query.roomsTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })
  
  // get booked rooms
  describe.skip("getBookedRoomsService", () => {
    it("should return booked rooms with booking, guest, room, and price data", async () => {
      const bookedRooms = [
        {
          bookingId: "booking-1",
          guestId: "guest-1",
          roomNumber: "1A",
          price: "1500.00",
        },
      ]
      const orderByMock = jest.fn().mockResolvedValue(bookedRooms)
      const secondLeftJoinMock = jest.fn().mockReturnValue({ orderBy: orderByMock })
      const firstLeftJoinMock = jest.fn().mockReturnValue({
        leftJoin: secondLeftJoinMock,
      })
      const fromMock = jest.fn().mockReturnValue({
        leftJoin: firstLeftJoinMock,
      })
      ;(db.select as jest.Mock).mockReturnValue({ from: fromMock })

      const result = await getBookedRoomsService()

      expect(db.select).toHaveBeenCalledWith({
        bookingId: bookingsTable.bookingId,
        guestId: guestsTable.guestId,
        roomNumber: roomsTable.roomNumber,
        price: roomsTable.pricePerNight,
      })
      expect(fromMock).toHaveBeenCalledWith(bookingsTable)
      expect(firstLeftJoinMock).toHaveBeenCalledWith(guestsTable, expect.anything())
      expect(secondLeftJoinMock).toHaveBeenCalledWith(roomsTable, expect.anything())
      expect(orderByMock).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(bookedRooms)
    })

    it("should return an empty array when there are no booked rooms", async () => {
      const orderByMock = jest.fn().mockResolvedValue([])
      const secondLeftJoinMock = jest.fn().mockReturnValue({ orderBy: orderByMock })
      const firstLeftJoinMock = jest.fn().mockReturnValue({
        leftJoin: secondLeftJoinMock,
      })
      const fromMock = jest.fn().mockReturnValue({
        leftJoin: firstLeftJoinMock,
      })
      ;(db.select as jest.Mock).mockReturnValue({ from: fromMock })

      const result = await getBookedRoomsService()

      expect(db.select).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  // get room occupied by user
  describe.skip("getRoomByGuestService", () => {
    it("should return rooms occupied by a guest contact", async () => {
      const roomsByGuest = [
        {
          roomNumber: "1A",
          guestId: "guest-1",
          guestContact: "070865564",
        },
      ]
      const whereMock = jest.fn().mockResolvedValue(roomsByGuest)
      const leftJoinMock = jest.fn().mockReturnValue({ where: whereMock })
      const fromMock = jest.fn().mockReturnValue({ leftJoin: leftJoinMock })
      ;(db.select as jest.Mock).mockReturnValue({ from: fromMock })

      const result = await getRoomByGuestService("070865564")

      expect(db.select).toHaveBeenCalledWith({
        roomNumber: roomsTable.roomNumber,
        guestId: guestsTable.guestId,
        guestContact: guestsTable.guestContact,
      })
      expect(fromMock).toHaveBeenCalledWith(roomsTable)
      expect(leftJoinMock).toHaveBeenCalledWith(guestsTable, expect.anything())
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(result).toEqual(roomsByGuest)
    })

    it("should return an empty array when no room matches the guest contact", async () => {
      const whereMock = jest.fn().mockResolvedValue([])
      const leftJoinMock = jest.fn().mockReturnValue({ where: whereMock })
      const fromMock = jest.fn().mockReturnValue({ leftJoin: leftJoinMock })
      ;(db.select as jest.Mock).mockReturnValue({ from: fromMock })

      const result = await getRoomByGuestService("0000000000")

      expect(db.select).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })
  
  // update room by num
  describe.skip("updateRoomService", ()=>{
    it("update room and have a returning value", async () => {
      const roomNum = "2A"
      const updateValue = {roomstatus: "booked"}
      const mockUpdatedRoom = {
        roomNumber: "2A",
        roomDescription: "Bedsitter: one bathroom, dinner and breakfast included",
        address: "Pamki Building, Kimathi way Nyeri down town",
        maxGuest: 2,
        pricePerNight: "1500.00",
        roomstatus: "bookeed"
      }

      const setMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis(undefined);
      const returningMock = jest.fn().mockResolvedValue([mockUpdatedRoom]);
      (db.update as jest.Mock).mockReturnValue({
        set: setMock,
        where: whereMock,
        returning: returningMock
      })

      const result = await updateRoomService(roomNum, updateValue)
      expect(setMock).toHaveBeenCalledWith(updateValue)
      expect(whereMock).toHaveBeenCalled()
      expect(returningMock).toHaveBeenCalled()
      expect(result).toEqual([mockUpdatedRoom])
    })

    // return null when room not updated
    it("should return a null if not updated", async () => {
      const roomNum = "2A"
      const updateRoom = {roomstatus: "booked"}

      const setMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis();
      const returningMock = jest.fn().mockResolvedValue();
      (db.update as jest.Mock).mockReturnValue({
        set: setMock,
        where: whereMock,
        returning: returningMock
      })

      const result = await updateRoomService(roomNum, updateRoom)
      // expect(setMock).toHaveBeenCalledWith(updateRoom)
      expect(whereMock).toHaveBeenCalled()
      expect(returningMock).toHaveBeenCalled()
      expect(result).toBeNull()
      // expect(result).toEqual([]) // this only works if the returningMock has a returning empty array
    })
  });

  // delete room by num
  describe.skip("deleteRoomService", ()=>{
    it("should delete a room and return a message", async () => {
      const roomNum = "1A"
      const returningMock = jest.fn().mockResolvedValue([mockSavedRoom])
      const whereMock = jest.fn().mockReturnValue({returning: returningMock})
      ;(db.delete as jest.Mock).mockReturnValue({where: whereMock})

      const result = await deleteRoomService(roomNum)
      expect(db.delete).toHaveBeenCalledWith(roomsTable)
      expect(returningMock).toHaveBeenCalled()
      expect(whereMock).toHaveBeenCalled()
      expect(result).toBe("Room deleted")
    })
  })

  
})
