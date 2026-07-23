import request from "supertest"
import db from "../../src/Drizzle/db"
import { hostAdminTable, roomsTable, TIHost, TIRoom } from "../../src/Drizzle/schema"
import { eq } from "drizzle-orm"
import app from "../../src/server"
import bcrypt from "bcryptjs"


let token: string;
let hostAdminId: string;

let testHost: TIHost = {
  firstName: "Dominic", 
  lastName: "test",
  hostEmail: "testhost@example.com",
  hostContact: "0712346748",
  hostPasswordHash: "password123"
}
const mockRoom: TIRoom = {
  "roomNumber": "1A",
  "roomDescription": "Bedsitter: one bathroom, one bed, dinner and breakfast included",
  "address": "Pamki Building, Kimathi way Nyeri down town",
  "maxGuest": 2,
  "pricePerNight": "1500.00"
  // "roomStatus": "vacant"
}

// beforeEach(async () => {
//   await db.delete(roomsTable)
//     .where(eq(roomsTable.roomNumber, mockRoom.roomNumber))

//   await db.delete(hostAdminTable)
//     .where(eq(hostAdminTable.hostEmail, testHost.hostEmail));
// })

beforeAll(async() => {
  // {Note before a host or any user in any system that has authentication and authorization feature, the user must first exist in order tobe able to login into the system, thus the creation of the user first in this mock followed by login}
  
  // create the host
  const hashedpass = bcrypt.hashSync(testHost.hostPasswordHash, 5)
  const [hostAdmin] = await db.insert(hostAdminTable).values({
    ...testHost,
    hostPasswordHash: hashedpass,
    role: "hostAdmin"
  }).returning()
  hostAdminId = hostAdmin.hostAdminId

  // login the host
  const loginRes = await request(app)
  .post("/auth/loginhost")
  .send({
    hostEmail: "testhost@example.com",
    hostPasswordHash: "password123"
  })
  token = loginRes.body.token

  // create a room fo retrival | deletion | update
  await db.insert(roomsTable).values(mockRoom)
  const roomRes = await request(app)
  .post("/todo")
  .set("Authorization", `Bearer ${token}`)
  .send(mockRoom)
    
})

afterAll(async () => {
  await db.delete(roomsTable)
    .where(eq(roomsTable.roomNumber, mockRoom.roomNumber))

  await db.delete(hostAdminTable)
    .where(eq(hostAdminTable.hostEmail, testHost.hostEmail));
  await db.$client.end()
})

describe("post create room", ()=>{
  it.skip("should create  a new room and return message and data", async () => {
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

  it.skip("should create a room only when the host is logged in and authorized", async () => {
    const mockRoom = {
      "roomNumber": "1A",
      "roomDescription": "Bedsitter: one bathroom, one bed, dinner and breakfast included",
      "address": "Pamki Building, Kimathi way Nyeri down town",
      "maxGuest": 2,
      "pricePerNight": "1500.00"
      // "roomStatus": "vacant"
    }
    
    const res = await request(app)
    .post("/auth/rooms/create")
    .set("Authorization", `Bearer ${token}`) // the word bearer and token should have a space between them
    .send(mockRoom)

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("message", 'Room created successfully')
  })

  it.skip("should return all rooms", async () => {
    const res = await request(app)
    .get("/auth/rooms/getall")

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("data", expect.anything())
  })

  it("should get room by num", async () => {
    const res = await request(app)
    .get(`/auth/rooms/roombynum/${"1A"}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("data", expect.anything())
  })


})