import db from "../Drizzle/db";
import { eq } from "drizzle-orm";
import { roomApprovalTable, roomsTable, TIApproval } from "../Drizzle/schema";

// create approval
export const createApprovalService = async (approval: TIApproval) => {
 const newApproval = await db.insert(roomApprovalTable).values(approval).returning()
  return newApproval
};

// get all approvals
export const getAllApprovalsService = async () => {
  const approvals = await db.query.roomApprovalTable.findMany()
  return approvals
};

// get approval by its id
export const getApprovalByIdService = async (approvalId: string) => {
  const approval = await db.query.roomApprovalTable.findFirst({where: eq(roomApprovalTable.approvalId, approvalId)})
  return approval
};

// get approval by room num
export const getApprovalByRoomNumService = async (roomNum: string) => {
  const approval = await db.query.roomApprovalTable.findFirst({where: eq(roomApprovalTable.approvedRoomNum, roomNum)})
  return approval
};

// get approval by guest id
export const getApprovalByGuestIdService = async (guestId: string) => {
  const approval = await db.query.roomApprovalTable.findFirst({where: eq(roomApprovalTable.approvedGuestId, guestId)})
  return approval
};

// get approval by host id
export const getApprovalByHostIdService = async (hostId: string) => {
  const approval = await db.query.roomApprovalTable.findFirst({where: eq(roomApprovalTable.approvingHostId, hostId)})
  return approval
};

// get pending approvals
export const getPendingApprovalsService = async () => {
  const pending = await db.query.roomApprovalTable.findMany({where: eq(roomApprovalTable.roomAprovalStatus, "pending")})
  return pending
}

// get approved approvals
export const getApprovedApprovalsService = async () => {
  const approved = await db.query.roomApprovalTable.findMany({where: eq(roomApprovalTable.roomAprovalStatus, "approved")})
  return approved
}

// get rejected approvals
export const getRejectedApprovalsService = async () => {
  const rejected = await db.query.roomApprovalTable.findMany({where: eq(roomApprovalTable.roomAprovalStatus, "rejected")})
  return rejected
}

// update approval by its id
export const updateApprovalByIdService = async (approvalId: string, updateData:Partial<TIApproval>) => {
  const updatedApproval = await db.update(roomApprovalTable)
  .set(updateData)
  .where(eq(roomApprovalTable.approvalId, approvalId))
  .returning()
  return updatedApproval
};

// update approval by room num
export const updateApprovalByRoomNumService = async (roomNum: string, updateData:Partial<TIApproval>) => {
  const updatedApproval = await db.update(roomApprovalTable)
  .set(updateData)
  .where(eq(roomApprovalTable.approvedRoomNum, roomNum))
  .returning()
  return updatedApproval
};

// update approval by guest id
export const updateApprovalByGuestIdService= async (guestId: string, updateData:Partial<TIApproval>) => {
  const updatedApproval = await db.update(roomApprovalTable)
  .set(updateData)
  .where(eq(roomApprovalTable.approvedGuestId, guestId))
  .returning()
  return updatedApproval
};

// delete approval by its id
export const deleteApprovalByIdService = async (approvalId: string) => {
  await db.delete(roomApprovalTable).where(eq(roomApprovalTable.approvalId, approvalId))
  return "Approval was successfully deleted"
};

// delete approval by room num
export const deleteApprovalByRoomNumService =async (roomNum: string) => {
  await db.delete(roomApprovalTable).where(eq(roomApprovalTable.approvedRoomNum, roomNum))
  return "Approval for the room was deleted successfully"
};