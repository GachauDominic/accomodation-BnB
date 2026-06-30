import db from "../Drizzle/db";
import { guestsTable, hostAdminTable, TIGuest, TIHost } from "../Drizzle/schema";

export const createHostService = async (host:TIHost) => {
  await db.insert(hostAdminTable).values(host)
  return "Host created successfully"
}

export const createGuestService = async (guest:TIGuest) => {
  await db.insert(guestsTable).values(guest)
  return "Guest created successfully"
}
