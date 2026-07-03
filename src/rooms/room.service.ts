import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { roomsTable, TIRoom, TSRoom, guestsTable } from "../Drizzle/schema";

// get all rooms
export const getAllRoomsService = async () => {
  const rooms = await db.query.roomsTable.findMany()
  return rooms
} 

// get room by number
export const getRoomService = async (roomNum:string) => {
  const room = await db.query.roomsTable.findFirst({where: eq(roomsTable.roomNumber, roomNum)})
  return room
}

// create room
export const createRoomService = async (room:TIRoom) => {
  const insertedRoom = await db.insert(roomsTable).values(room);
  if (insertedRoom) {
    return insertedRoom
  }
  return null
};

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
  const occupiedRooms = await db.query.roomsTable.findMany({where: eq(roomsTable.roomstatus, "occupied")})
  return occupiedRooms;
}

//  get vacant rooms
export const getVacantRoomsService = async () => {
  const vacantRooms = await db.query.roomsTable.findMany({where: eq(roomsTable.roomstatus, "vacant")})
  return vacantRooms;
}

// get booked rooms
export const getBookedRoomsService = async () => {
  const bookedRooms = await db.query.roomsTable.findMany({where: eq(roomsTable.roomstatus, "booked")})
  return bookedRooms;
}

// get room occupied by user
export const getRoomByGuestService = async (guestContact: string) => {
  // right join guestsTable and roomsTable where guest contact matches
  const occupiedRoom = await db.select()
    .from(guestsTable)
    .rightJoin(roomsTable, eq(roomsTable.roomNumber, guestsTable.guestRoomNumber))
    .where(eq(guestsTable.guestContact, guestContact));

  return occupiedRoom;
}