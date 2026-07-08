import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { guestsTable, roomsTable, TIGuest } from "../Drizzle/schema";

// create guest
export const createGuestService = async (guest:TIGuest) => {
 const newGuest = await db.insert(guestsTable).values(guest).returning()
  return newGuest
}

// login guest
export const loginGuestService = async (guest: TIGuest) => {
  const {guestContact} = guest; // guest in the parameter
  return await db.query.guestsTable.findFirst({
    columns: {
      guestId: true,
      guestfirstName: true,
      guestlastName: true,
      guestContact: true,
    },
    where: eq(guestsTable.guestContact, guestContact)
  })
};

// get all guest
export const getAllGuestService = async () => {
 const guests = await db.query.guestsTable.findMany()
 return guests;
};

// get guest by id
export const getGuestByIdService = async (guestId:string) => {
  const guest = await db.select({
  // guestId: guestsTable.guestId, 
  guestfirstName:guestsTable.guestfirstName, 
  guestlastName: guestsTable.guestlastName, 
  guestContact: guestsTable.guestContact,
  guestRoomNumber: guestsTable.guestRoomNumber
  })
  .from(guestsTable)
  .where(eq(guestsTable.guestId, guestId))
  return guest;
};

//  get guest by contact
export const getGuestByContactService = async (guestContact:string) => {
  const guest = await db.select({
  guestId: guestsTable.guestId, 
  guestfirstName:guestsTable.guestfirstName, 
  guestlastName: guestsTable.guestlastName, 
  // guestContact: guestsTable.guestContact,
  guestRoomNumber: guestsTable.guestRoomNumber
  })
  .from(guestsTable)
  .where(eq(guestsTable.guestContact, guestContact))
  return guest;
};

// get guest by room num {join query}
export const getGuestByRoomService = async (guestRoomNum:string) => {
 const guest = await db.select({
  guestId: guestsTable.guestId, 
  guestfirstName:guestsTable.guestfirstName, 
  guestlastName: guestsTable.guestlastName, 
  guestContact: guestsTable.guestContact,
  // guestRoomNumber: guestsTable.guestRoomNumber
 })
  .from(guestsTable)
  .leftJoin(roomsTable, eq(roomsTable.roomNumber, guestsTable.guestRoomNumber))
  .where(eq(roomsTable.roomNumber, guestRoomNum))
  return guest;
};

// update guest by contact
export const updateGuestService = async (guestContact: string, updateGuest: Partial<TIGuest>) => {
  const [updatedGuest] = await db.update(guestsTable)
    .set(updateGuest)
    .where(eq(guestsTable.guestContact, guestContact))
    .returning()
  return updatedGuest ?? null;
}

// delete guest by contact
export const deleteGuestService = async (guestContact:string) => {
  await db.delete(guestsTable).where(eq(guestsTable.guestContact, guestContact))
  return "Guest deleted"
}