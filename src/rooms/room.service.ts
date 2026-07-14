import { desc, eq, asc} from "drizzle-orm";
import db from "../Drizzle/db";
import { roomsTable, TIRoom, TSRoom, guestsTable, bookingsTable } from "../Drizzle/schema";

// create room
export const createRoomService = async (room:TIRoom) => {
  const insertedRoom = await db.insert(roomsTable).values(room).returning()
  if (insertedRoom) {
    return insertedRoom
  }
  return null
};

// get all rooms
export const getAllRoomsService = async () => {
  const rooms = await db.query.roomsTable.findMany({
    orderBy: [asc(roomsTable.roomNumber)],
  })
  
  return rooms
} 

// get room by number
export const getRoomByNumService = async (roomNum:string) => {
  const room = await db.query.roomsTable.findFirst({where: eq(roomsTable.roomNumber, roomNum)})
  return room
}

// update room
export const updateRoomService = async(roomNum: string, updateRoom: Partial<TIRoom>)=>{
  const updatedRoom = await db.update(roomsTable)
  .set(updateRoom)
  .where(eq(roomsTable.roomNumber, roomNum))
  .returning()
  return updatedRoom;
}

// delete room by roomNum
export const deleteRoomService = async (roomNum:string) => {
  await db.delete(roomsTable).where(eq(roomsTable.roomNumber, roomNum)).returning();
  return "Room deleted";
}

//  get occupied rooms
export const getOccupiedRoomsService = async () => {
  const [occupiedRooms] = await db.select({
    roomNumber: roomsTable.roomNumber,
    guestId: guestsTable.guestId,
  })
  .from(bookingsTable)
  .innerJoin(
    roomsTable,
    eq(bookingsTable.bookingRoomNumber, roomsTable.roomNumber)
  )
  .innerJoin(
    guestsTable,
    eq(bookingsTable.bookingGuestId, guestsTable.guestId)
  )
  .where(eq(roomsTable.roomstatus, "occupied"))
  .orderBy(asc(roomsTable.roomNumber));
  return occupiedRooms;
}

//  get vacant rooms
export const getVacantRoomsService = async () => {
  const vacantRooms = await db.query.roomsTable.findMany({
    where: eq(roomsTable.roomstatus, "vacant"),
    orderBy: [asc(roomsTable.roomNumber)],
  })
  return vacantRooms;
}

// get booked rooms
export const getBookedRoomsService = async () => {
  const bookedRooms = await db.select({
    bookingId: bookingsTable.bookingId,
    guestId: guestsTable.guestId,
    roomNumber: roomsTable.roomNumber,
    price: roomsTable.pricePerNight,
  })
  .from(bookingsTable)
  .leftJoin(
    guestsTable,
    eq(bookingsTable.bookingGuestId, guestsTable.guestId)
  )
  .leftJoin(
    roomsTable,
    eq(bookingsTable.bookingRoomNumber, roomsTable.roomNumber)
  )
  .orderBy(asc(roomsTable.roomNumber));
  return bookedRooms;
}

// get room occupied by user
export const getRoomByGuestService = async (guestContact: string) => {
  // left join guestsTable and roomsTable where guest contact matches
  const roomByGuest = await db.select({
    roomNumber: roomsTable.roomNumber,
    guestId: guestsTable.guestId,
    guestContact: guestsTable.guestContact
  })
  .from(roomsTable)
  .leftJoin(guestsTable, eq(roomsTable.roomNumber, guestsTable.guestRoomNumber))
  .where(eq(guestsTable.guestContact, guestContact));
  return roomByGuest;
}