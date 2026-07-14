import { describe, it, afterEach, expect, jest } from "@jest/globals"
import {
  createHostService,
  deleteHostService,
  getAllHostService,
  getHostByIdService,
  loginHostService,
  updateHostService,
} from "../../src/auth/auth.service"
import * as db from "../../src/Drizzle/db"
import { hostAdminTable } from "../../src/Drizzle/schema"

const mockHost = {
  firstName: "Dominic",
  lastName: "Maish",
  hostEmail: "dom@example.com",
  hostContact: "0790809709",
  hostPasswordHash: "dom@1234",
}

const mockSavedHost = {
  hostAdminId: "1",
  role: "hostAdmin",
  ...mockHost,
}

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    hostAdminTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

describe("Auth service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("createHostService", () => {
    it("creates a host and returns the created host data", async () => {
      const returningMock = jest.fn().mockResolvedValue([mockSavedHost])
      const valuesMock = jest.fn().mockReturnValue({ returning: returningMock });
      (db.insert as jest.Mock).mockReturnValue({ values: valuesMock })

      const result = await createHostService(mockHost)

      expect(db.insert).toHaveBeenCalledWith(hostAdminTable)
      expect(valuesMock).toHaveBeenCalledWith(mockHost)
      expect(returningMock).toHaveBeenCalled()
      expect(result).toEqual([mockSavedHost])
    })
  })

  describe("getHostByIdService", () => {
    it("gets a host by id", async () => {
      ;(db.query.hostAdminTable.findFirst as jest.Mock).mockResolvedValue(mockSavedHost)

      const result = await getHostByIdService("1")

      expect(db.query.hostAdminTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.anything(),
        })
      )
      expect(result).toEqual(mockSavedHost)
    })

    it("returns undefined when no host is found", async () => {
      ;(db.query.hostAdminTable.findFirst as jest.Mock).mockResolvedValue(undefined)

      const result = await getHostByIdService("missing-host-id")

      expect(db.query.hostAdminTable.findFirst).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("getAllHostService", () => {
    it("gets all hosts", async () => {
      const hosts = [
        mockSavedHost,
        {
          hostAdminId: "2",
          firstName: "Jane",
          lastName: "Doe",
          hostEmail: "jane@example.com",
          hostContact: "0700000000",
          hostPasswordHash: "jane@1234",
          role: "hostAdmin",
        },
      ]
      ;(db.query.hostAdminTable.findMany as jest.Mock).mockResolvedValue(hosts)

      const result = await getAllHostService()

      expect(db.query.hostAdminTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(hosts)
    })

    it("returns an empty array when there are no hosts", async () => {
      ;(db.query.hostAdminTable.findMany as jest.Mock).mockResolvedValue([])

      const result = await getAllHostService()

      expect(db.query.hostAdminTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe("loginHostService", () => {
    it("gets a host login record by email", async () => {
      const loginRecord = {
        hostAdminId: "1",
        firstName: "Dominic",
        lastName: "Maish",
        hostEmail: "dom@example.com",
        hostPasswordHash: "dom@1234",
        role: "hostAdmin",
      }
      ;(db.query.hostAdminTable.findFirst as jest.Mock).mockResolvedValue(loginRecord)

      const result = await loginHostService(mockHost)

      expect(db.query.hostAdminTable.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: {
            hostAdminId: true,
            firstName: true,
            lastName: true,
            hostEmail: true,
            hostPasswordHash: true,
            role: true,
          },
          where: expect.anything(),
        })
      )
      expect(result).toEqual(loginRecord)
    })

    it("returns undefined when the login email is not found", async () => {
      ;(db.query.hostAdminTable.findFirst as jest.Mock).mockResolvedValue(undefined)

      const result = await loginHostService({
        ...mockHost,
        hostEmail: "missing@example.com",
      })

      expect(db.query.hostAdminTable.findFirst).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe("updateHostService", () => {
    it("updates a host by id and returns the updated host data", async () => {
      const updateData = {
        ...mockHost,
        firstName: "Dom",
      }
      const updatedHost = {
        ...mockSavedHost,
        firstName: "Dom",
      }
      const returningMock = jest.fn().mockResolvedValue([updatedHost])
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock })
      const setMock = jest.fn().mockReturnValue({ where: whereMock })
      ;(db.update as jest.Mock).mockReturnValue({ set: setMock })

      const result = await updateHostService("1", updateData)

      expect(db.update).toHaveBeenCalledWith(hostAdminTable)
      expect(setMock).toHaveBeenCalledWith(updateData)
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(returningMock).toHaveBeenCalled()
      expect(result).toEqual([updatedHost])
    })

    it("returns an empty array when no host is updated", async () => {
      const returningMock = jest.fn().mockResolvedValue([])
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock })
      const setMock = jest.fn().mockReturnValue({ where: whereMock })
      ;(db.update as jest.Mock).mockReturnValue({ set: setMock })

      const result = await updateHostService("missing-host-id", mockHost)

      expect(db.update).toHaveBeenCalledWith(hostAdminTable)
      expect(returningMock).toHaveBeenCalled()
      expect(result).toEqual([])
    })
  })

  describe("deleteHostService", () => {
    it("deletes a host by id and returns a success message", async () => {
      const returningMock = jest.fn().mockResolvedValue([mockSavedHost])
      const whereMock = jest.fn().mockReturnValue({ returning: returningMock })
      ;(db.delete as jest.Mock).mockReturnValue({ where: whereMock })

      const result = await deleteHostService("1")

      expect(db.delete).toHaveBeenCalledWith(hostAdminTable)
      expect(whereMock).toHaveBeenCalledWith(expect.anything())
      expect(returningMock).toHaveBeenCalled()
      expect(result).toBe("Host deleted successfully")
    })
  })
})
