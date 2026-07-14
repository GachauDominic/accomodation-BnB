import { describe, it, afterEach, expect, jest } from "@jest/globals"
import { createHostService, loginHostService } from "../../src/auth/auth.service"
import db from "../../src/Drizzle/db"

const mockHost = {
  firstName: "Dominic",
  lastName: "Maish",
  hostEmail: "dom@exaomple.com",
  hostContact: "0790809709",
  hostPasswordHash: "dom@1234"
}

//mocking
jest.mock("../../src/Drizzle/db", () => ({
	insert: jest.fn(()=>({ //mocking the insert method from/with db
		values: jest.fn().mockReturnThis(), // used to return the same object as you inserted
		returning: jest.fn().mockResolvedValue([{ hostAdminId: "1", ...mockHost }]) // mock the returning method
	})),

	query: { //mocking the query method from/with db
		hostAdminTable: {
			findFirst: jest.fn(),
      findMany: jest.fn()
		},
	}
}))

describe("Auth service", ()=>{
  afterEach(()=>{
    jest.clearAllMocks()
  })

  // creation of host
  describe.skip("create a host", ()=>{
    it("should create a host and return a the data of the host", async()=>{
      const host = {
        firstName: "Dominic",
        lastName: "Maish",
        hostEmail: "dom@exaomple.com",
        hostContact: "0790809709",
        hostPasswordHash: "dom@1234"
      };
      const result = await createHostService(host)
      expect(db.insert).toHaveBeenCalled()
      expect(result).toContainEqual(expect.objectContaining(host))
    })
  });

  // login ahost
  describe("login host", ()=>{
    it("should login a host and return the data of that host", async () => {
      const hostLogin = {
        // hostId: 1,
        firstName: "Dominic",
        lastName:"Maish",
        hostContact: "0790809709",
        // role: "hostAdmin",
        hostEmail: "dom@exaomple.com",
        hostPasswordHash: "dom@1234"
      };
			(db.query.hostAdminTable.findFirst as jest.Mock).mockResolvedValueOnce(hostLogin)
      
      const result = await loginHostService(hostLogin)
      expect(db.query.hostAdminTable.findFirst).toHaveBeenCalled()
      expect(result).toEqual(hostLogin)
            
    })
  })
})
