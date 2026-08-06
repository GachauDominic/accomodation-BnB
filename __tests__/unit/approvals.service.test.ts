import { describe, it, beforeEach, afterEach, expect, jest } from "@jest/globals";
import * as db from "../../src/Drizzle/db"
import { roomApprovalTable, TIApproval } from "../../src/Drizzle/schema";
import { createApprovalService, getAllApprovalsService, getApprovalByIdService, getApprovalByRoomNumService, getApprovalByGuestIdService, getApprovalByHostIdService, getPendingApprovalsService, getApprovedApprovalsService, getRejectedApprovalsService, updateApprovalByIdService, updateApprovalByRoomNumService, updateApprovalByGuestIdService, deleteApprovalByIdService, deleteApprovalByRoomNumService  } from "../../src/approvals/approvals.service";

const approvalValueMock = {
  approvalId: "0295f504-9734-4f4",
  approvedRoomNum: "2A",
  approvingHostId: "0295f504-9734-4f45-9b04-c41348cf7456",
  approvedGuestId: "6ffad33b-1bbc-4fef-9305-7ddb91ec81f6",
  roomAprovalStatus: "approved"
}
  
// jest db mock
jest.mock('../../src/Drizzle/db', ()=>{
  const dbMock = {
    insert: jest.fn(),
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
      roomApprovalTable: {
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

describe("room approvals services", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks()
  })

  afterEach(()=>{
    jest.clearAllMocks()
  });


  describe("createApprovalService", ()=>{
    it('should approve a room to a guest', async () => {
      const newMockApproval: TIApproval = {
        "approvedRoomNum": "2A",
        "approvingHostId": "4-4f45-9b04-c41348cf7456",
        "approvedGuestId": "fef-9305-7ddb91ec81f6",
        "roomAprovalStatus": "approved",
      }
      
      const returningMock = jest.fn().mockResolvedValue(approvalValueMock)
      const retunValueMock = jest.fn().mockReturnValue({returning: returningMock})
        ;(db.insert as jest.Mock).mockReturnValue({values: retunValueMock})

        const result = await createApprovalService(newMockApproval)
        expect(db.insert).toHaveBeenCalledWith(roomApprovalTable)
        expect(retunValueMock).toHaveBeenCalledWith(newMockApproval)
        expect(returningMock).toHaveBeenCalled()
        expect(result).toEqual(approvalValueMock)
      
    })

    it("should return null if approval is not created", async () => {
      const returningMock = jest.fn().mockResolvedValue(null)
      const returnValueMock = jest.fn().mockReturnValue({returning: returningMock})
        ;(db.insert as jest.Mock).mockReturnValue({values: returnValueMock})

      const result = await createApprovalService()
      expect(db.insert).toHaveBeenCalledWith(roomApprovalTable)
      expect(returnValueMock).toHaveBeenCalled()
      expect(returningMock).toHaveBeenCalled()
      expect(result).toBeNull()
    })

  })

  describe("getAllApprovalsService", ()=>{
    it("get all approvals", async () => {
      const allApprovalsMock = [
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "9734-4f45-9b04-c41348cf7456",
          "approvedGuestId": "4fef-9305-7ddb91ec81f6",
          "roomAprovalStatus": "approved",
        }
      ]
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce(allApprovalsMock) // get all such as this is a mockReturnValueOnce

      const result = await getAllApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(allApprovalsMock)
    })

    it("should return empty array if no approvals", async () => {
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce([])
      
      const result = await getAllApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe("getApprovalByIdService", ()=>{
    it('should get an approval through its ID', async () => {
      const approvalId = 'uiukjd-16-qfgha'
      const returnMock = 
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "4f45-9b04-c41348cf7456",
          "approvedGuestId": "4fef-9305-7ddb91ec81f6",
          "roomAprovalStatus": "approved",
      }

      const returningMock = jest.fn().mockResolvedValue(returnMock)
        ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(returnMock)

      const result = await getApprovalByIdService(approvalId)
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBe(returnMock)
    })

    it("should return empty array if not found", async () => {
      ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue([])

      const result = await getApprovalByIdService()
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toEqual([])
    })
  })

  describe('getApprovalByRoomNumService', ()=>{
    it('should get an approval through its room num', async () => {
      const approvalRoomNum = '2A'
      const returnMock = 
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "4f45-9b04-c41348cf7456",
          "approvedGuestId": "05-7ddb91ec81f6",
          "roomAprovalStatus": "approved",
      }

      const returningMock = jest.fn().mockResolvedValue(returnMock)
        ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(returnMock)

      const result = await getApprovalByRoomNumService(approvalRoomNum)
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBe(returnMock)
    })

    it("should return empty array if not found", async () => {
      ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(null)

      const result = await getApprovalByRoomNumService()
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBeNull()
    })
  })

  describe('getApprovalByGuestIdService', ()=>{
    it('should get an approval through its room num', async () => {
      const approvedGuestId = '9b04-c41348cf7456'
      const returnMock = 
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "c41348cf7456",
          "approvedGuestId": "9b04-c41348cf7456",
          "roomAprovalStatus": "approved",
      }

      const returningMock = jest.fn().mockResolvedValue(returnMock)
        ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(returnMock)

      const result = await getApprovalByRoomNumService(approvedGuestId)
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBe(returnMock)
    })

    it("should return null if not found", async () => {
      ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(null)

      const result = await getApprovalByGuestIdService()
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBeNull()
    })
  })

  describe('getApprovalByHostIdService', ()=>{
    it('should get an approval through hostId', async () => {
      const approvingHostId = '41348cf7456'
      const returnMock = 
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "41348cf7456",
          "approvedGuestId": "9b04-c41348cf7456",
          "roomAprovalStatus": "approved",
      }

      const returningMock = jest.fn().mockResolvedValue(returnMock)
        ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(returnMock)

      const result = await getApprovalByRoomNumService(approvingHostId)
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBe(returnMock)
    })

    it("should return null if not found", async () => {
      ;(db.query.roomApprovalTable.findFirst as jest.Mock).mockResolvedValue(null)

      const result = await getApprovalByHostIdService()
      expect(db.query.roomApprovalTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.anything(),
      }));
      expect(result).toBeNull()
    })
  })

  describe('getPendingApprovalsService', ()=>{
    it("get all pending approvals", async () => {
      const allPendingApprovalsMock = [
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "9734-4f45-9b04-c41348cf7456",
          "approvedGuestId": "4fef-9305-7ddb91ec81f6",
          "roomAprovalStatus": "approved",
        }
      ]
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce(allPendingApprovalsMock) // get all such as this is a mockReturnValueOnce

      const result = await getPendingApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(allPendingApprovalsMock)
    })

    it("should return empty array if no pending approvals", async () => {
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce([])
      
      const result = await getPendingApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe('getApprovedApprovalsService', ()=>{
    it("get all pending approvals", async () => {
      const allApprovedApprovalsMock = [
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "9734-4f45-9b04-c41348cf7456",
          "approvedGuestId": "4fef-9305-7ddb91ec81f6",
          "roomAprovalStatus": "approved",
        }
      ]
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce(allApprovedApprovalsMock) // get all such as this is a mockReturnValueOnce

      const result = await getApprovedApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(allApprovedApprovalsMock)
    })

    it("should return empty array if no approved approvals", async () => {
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce([])
      
      const result = await getApprovedApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe('getRejectedApprovalsService', ()=>{
    it("get all pending approvals", async () => {
      const allRejectedApprovalsMock = [
        {
          "approvedRoomNum": "2A",
          "approvingHostId": "9734-4f45-9b04-c41348cf7456",
          "approvedGuestId": "4fef-9305-7ddb91ec81f6",
          "roomAprovalStatus": "approved",
        }
      ]
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce(allRejectedApprovalsMock) // get all such as this is a mockReturnValueOnce

      const result = await getRejectedApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(allRejectedApprovalsMock)
    })

    it("should return empty array if no approved approvals", async () => {
      ;(db.query.roomApprovalTable.findMany as jest.Mock).mockReturnValueOnce([])
      
      const result = await getRejectedApprovalsService()
      expect(db.query.roomApprovalTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

})