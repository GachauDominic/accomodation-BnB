import { describe, it, beforeEach, afterEach, expect } from "@jest/globals";
import { createGuestService, getAllGuestService, getGuestByContactService, getGuestByRoomService, loginGuestService, updateGuestService, deleteGuestService } from "../../src/guests/guest.service"
import * as db from "../../src/Drizzle/db"
import { guestsTable } from "../../src/Drizzle/schema";


const mockGuest = {
    guestFirstName: "Mikel",
    guestLastName: "Bond",
    guestContact: "070865564",
    guestEmail: "Mikel@example.com",
    guestPassword: "mikel@123"
}

jest.mock("../../src/Drizzle/db", ()=>({
 insert: jest.fn(()=>({ //mocking the insert method from/with db
    values: jest.fn().mockReturnThis(), // used to return the same object as you inserted
    returning: jest.fn().mockResolvedValue([{ guestId: "1", ...mockGuest }]) // mock the returning method
  })),
 
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),

  query: { //mocking the query method from/with db
    guestsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  }
}))

describe("Guest services", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

   // creation of guest
  describe.skip("createGuestService", ()=>{
    it("should create a guest and return a the data of the guest", async()=>{
      const guest = {
        guestFirstName: "Mikel",
        guestLastName: "Bond",
        guestContact: "070865564",
        guestEmail: "Mikel@example.com",
        guestPassword: "mikel@123"
      };

      const result = await createGuestService(guest)
      expect(db.insert).toHaveBeenCalled()
      expect(result).toContainEqual(expect.objectContaining(guest))
      expect(result[0]).toMatchObject({
        guestFirstName: "Mikel",
        guestLastName: "Bond",
        guestContact: "070865564",
        guestEmail: "Mikel@example.com"
      })
    })
  });

  // login guest
  describe.skip("loginGuestService", ()=>{
    it("should login a guest and have a returning value", async () => {
      const loginDetails = {
        "guestContact": "0795063598"
      }
      const guestLogin = {
        guestFirstName: "Mikel",
        guestLastName: "Bond",
        guestContact: "070865564",
        guestEmail: "Mikel@example.com",
        guestPassword: "mikel@123"
      };
      (db.query.guestsTable.findFirst as jest.Mock).mockResolvedValueOnce(guestLogin)

      const result = await loginGuestService(loginDetails)
      expect(db.query.guestsTable.findFirst).toHaveBeenCalled()
      expect(result).toEqual(guestLogin)
    })
  });
  
  // get all guest
  describe.skip("getAllGuestService", ()=>{
    it("should get all available guest and return an array of object", async () => {
      const mockGuests = [
        {
          id: "1",
          guestFirstName: "Mikel",
          guestLastName: "Bond",
          guestContact: "070865564",
          guestEmail: "Mikel@example.com",
          guestPassword: "mikel@123"
        },

        {
          id: "2",
          guestFirstName: "Doon",
          guestLastName: "noom",
          guestContact: "0876573567",
          guestEmail: "dnoom@example.com",
          guestPassword: "dnomm@123"
        },

        {
          id: "3",
          guestFirstName: "jj",
          guestLastName: "ben",
          guestContact: "0988765467",
          guestEmail: "jjben@example.com",
          guestPassword: "jjben@123"
        }
      ];
      (db.query.guestsTable.findMany as jest.Mock).mockReturnValueOnce(mockGuests)
      
      const result = await getAllGuestService(mockGuests)
      expect(db.query.guestsTable.findMany).toHaveBeenCalled()
      expect(result).toEqual(mockGuests)
    }),

    it("should return an empty array if no guest found", async () => {
      const mockGuests = [];
      (db.query.guestsTable.findMany as jest.Mock).mockReturnValueOnce(mockGuests)

      const result = await getAllGuestService(mockGuests)
      expect(db.query.guestsTable.findMany).toHaveBeenCalled()
      expect(result).toEqual([])
      
    })
  });

  // get guest by contact
  describe.skip("getGuestByContactService", ()=>{
    it("should return a guest by contact", async () => {
      const guestContact = "070865564";
      const mockGuestResult = [{
        guestId: "1",
        guestFirstName: "Mikel",
        guestLastName: "Bond",
        guestRoomNumber: "101"
      }];

      const fromMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockResolvedValue(mockGuestResult);

      (db.select as jest.Mock).mockReturnValue({
        from: fromMock,
        where: whereMock,
      });

      const result = await getGuestByContactService(guestContact);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(guestsTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual(mockGuestResult);
    }),

    it("should return an empty array when the guest contact is not found", async () => {
      const guestContact = "0000000000";
      const fromMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockResolvedValue([]);

      (db.select as jest.Mock).mockReturnValue({
        from: fromMock,
        where: whereMock,
      });

      const result = await getGuestByContactService(guestContact);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(guestsTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    })
    
  });

  // get guest by room num
  describe.skip("getGuestByRoomService", () => {
    it("should return guest by guest room", async () => {
      const guestRoomNum = "1A";
      const mockGuestResult = [
        {
          guestId: "1",
          guestFirstName: "Mocha",
          guestLastName: "Milly",
          guestContact: "0789656789",
        },
      ];

      const fromMock = jest.fn().mockReturnThis();
      const leftJoinMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockResolvedValue(mockGuestResult);

      (db.select as jest.Mock).mockReturnValue({
        from: fromMock,
        leftJoin: leftJoinMock,
        where: whereMock,
      });

      const result = await getGuestByRoomService(guestRoomNum);
      expect(db.select).toHaveBeenCalled();
      expect(result).toEqual(mockGuestResult);
      expect(leftJoinMock).toHaveBeenCalled();
      expect(whereMock).toHaveBeenCalled();
    });

    it("should return empty array if the room number has no guest", async () => {
      const guestRoomNum = "2A";
      const fromMock = jest.fn().mockReturnThis();
      const leftJoinMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockResolvedValue([]);

      (db.select as jest.Mock).mockReturnValue({
        from: fromMock,
        leftJoin: leftJoinMock,
        where: whereMock,
      });

      const result = await getGuestByContactService(guestRoomNum);

      expect(db.select).toHaveBeenCalled();
      expect(fromMock).toHaveBeenCalledWith(guestsTable); 
      // expect(leftJoinMock).toHaveBeenCalled(); // since the result would be an empty array then typically speaking then there wouldn't be a left join so this expect can be left out
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    })
  });
  
  // update guest by contact
  
  describe.skip("updateGuestService", () => {
    it("updates a guest by contact and returns the updated guest", async () => {
      const guestContact = "070865564";
      const updateGuest = { guestFirstName: "Mikel" };
      const mockUpdatedGuest = {
        guestId: "1",
        guestContact: "070865564",
        guestFirstName: "Mikel"
      };

      const setMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis(undefined);
      const returningMock = jest.fn().mockResolvedValue([mockUpdatedGuest]);
      (db.update as jest.Mock).mockReturnValue({
        set: setMock,
        where: whereMock,
        returning: returningMock,
      });

      const result = await updateGuestService(guestContact, updateGuest);

      expect(db.update).toHaveBeenCalledWith(guestsTable);
      expect(setMock).toHaveBeenCalledWith(updateGuest);
      expect(whereMock).toHaveBeenCalled();
      expect(returningMock).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedGuest);
    });

    it("returns null when no guest is updated", async () => {
      const guestContact = "0000000000";
      const updateGuest = { guestFirstName: "NewName" };

      const setMock = jest.fn().mockReturnThis();
      const whereMock = jest.fn().mockReturnThis();
      const returningMock = jest.fn().mockResolvedValue([]);

      (db.update as jest.Mock).mockReturnValue({
        set: setMock,
        where: whereMock,
        returning: returningMock,
      });

      const result = await updateGuestService(guestContact, updateGuest);
      expect(result).toBeNull();
      
    });
  });

  // delete guest by contact
  describe.skip("deleteGuestService", () => {
    it("should delete a guest from the db and return a message", async () => {
      const guestContact = "070865564";
      
      // note there ia a returning mock since the actual service itself doesn't and thus the where clause is undefined
      const whereMock = jest.fn().mockResolvedValue(undefined); // Must be awaitable
      (db.delete as jest.Mock).mockReturnValue({
        where: whereMock,
      });

      const result = await deleteGuestService(guestContact);

      expect(db.delete).toHaveBeenCalledWith(guestsTable);
      expect(whereMock).toHaveBeenCalled();
      expect(result).toEqual("Guest deleted");
    });
  });

});

