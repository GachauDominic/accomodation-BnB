import request from "supertest"
import db from "../../src/Drizzle/db"
import { roomsTable } from "../../src/Drizzle/schema"
import { eq } from "drizzle-orm"
import app from "../../src/server"

// jest.mock("../../src/Drizzle/db", ()=>{
//   const dbMock = {
//     insert: jest.fn(),
//     select: jest.fn(),
//     update: jest.fn(),
//     delete: jest.fn(),
//     query: {
//       roomsTable: {
//         findFirst: jest.fn(),
//         findMany: jest.fn(),
//       },
//     },
//   }

//   return {
//     __esModule: true,
//     default: dbMock,
//     ...dbMock,
//   }
// })

let mockRoom = {
  "roomNumber": "1A",
  "roomDescription": "Bedsitter: one bathroom, one bed, dinner and breakfast included",
  "address": "Pamki Building, Kimathi way Nyeri down town",
  "maxGuest": 2,
  "pricePerNight": "1500.00",
  "roomStatus": "vacant"
}

let mockHost = {
  firstName: "Dominic",
  lastName: "test",
  hostEmail: "testuser@example.com",
  hostContact: "0712346748",
  hostPasswordHash: "password123"
}

// let token: string;

// beforeEach(()=>{
//   jest.clearAllMocks()
// });

// afterEach(()=>{
//   jest.clearAllMocks()
// });

beforeAll(async () => {
  // const [room] = await db.insert(roomsTable)
  // .values({...mockRoom})
  // .returning()

  // login for authorization
  // const res = await request(app)
  // .post("/auth/loginhost")
  // .send({
  //   hostEmail: mockHost.hostEmail,
  //   hostPasswordHash: mockHost.hostPasswordHash
  // })
  // token = res.body.token
})

afterAll(async () => {
  await db.delete(roomsTable)
  .where(eq(roomsTable.roomNumber, mockRoom.roomNumber))
  await db.$client.end()
})

describe("post create room", ()=>{
  it("should create  a new room and return message and data", async () => {
    const res = await request(app)
    .post("/auth/rooms/create")
    // .set("Authorization", `Bearer ${token}`)
    .send(mockRoom)

    // expect(res.statusCode).toBe(201)
    expect(res.body).toEqual({
      message: "Room created successfully",
      data: expect.any(Object),
    });
    expect(res.body.data[0]).toMatchObject({
      roomNumber: mockRoom.roomNumber,
      roomDescription: mockRoom.roomDescription,
      address: mockRoom.address,
      maxGuest: mockRoom.maxGuest,
      pricePerNight: mockRoom.pricePerNight,
    });
  })


})