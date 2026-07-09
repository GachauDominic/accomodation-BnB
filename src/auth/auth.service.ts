import { eq } from "drizzle-orm";
import db from "../Drizzle/db";
import { hostAdminTable, TIHost } from "../Drizzle/schema";

// create a host
export const createHostService = async (host:TIHost) => {
  const newHost = await db.insert(hostAdminTable).values(host).returning()
  return newHost
}

// get host by id
export const getHostByIdService = async (hostAdminId: string) => {
  const host = await db.query.hostAdminTable.findFirst({where: eq(hostAdminTable.hostAdminId, hostAdminId)})
  return host
};

// get all hosts
export const getAllHostService = async () => {
  const hosts = await db.query.hostAdminTable.findMany()
  return hosts
};

// login host
export const loginHostService = async (host: TIHost) => {
  const {hostEmail} = host;
  return await db.query.hostAdminTable.findFirst({
    columns: {
      hostAdminId: true,
      firstName: true,
      lastName: true,
      hostEmail: true,
      hostPasswordHash: true,
      role: true,
    },
    where: eq(hostAdminTable.hostEmail, hostEmail)
  })
};

// update host
export const updateHostService = async (hostId: string, updateData: TIHost) => {
  const updatedHost = await db.update(hostAdminTable)
  .set(updateData)
  .where(eq(hostAdminTable.hostAdminId, hostId))
  .returning()
  return updatedHost
}

// delete host by id
export const deleteHostService = async (hostId: string) => {
  await db.delete(hostAdminTable).where(eq(hostAdminTable.hostAdminId, hostId))
  .returning()
  return "Host deleted successfully"
}
