import request from "supertest";
import db from "../../src/Drizzle/db";
import { eq } from "drizzle-orm";
import app from "../../src/server";
import bcrypt from "bcryptjs";
import {
  guestsTable,
  hostAdminTable,
  roomApprovalTable,
  roomsTable,
  TIApproval,
  TIGuest,
  TIHost,
  TIRoom,
} from "../../src/Drizzle/schema";

let token: string;
let hostAdminId: string;
let guestId: string;

const roomNumber = "2A";

const testHost: TIHost = {
  firstName: "Dominic",
  lastName: "test",
  hostEmail: "testhost@example.com",
  hostContact: "0712346748",
  hostPasswordHash: "password123",
};

const testGuest: TIGuest = {
  guestFirstName: "Dom",
  guestLastName: "Maish",
  guestContact: "0700000000",
  guestEmail: "gachaudominic@gmail.com",
  guestPassword: "dom@123",
};

const mockRoom: TIRoom = {
  roomNumber,
  roomDescription: "Bedsitter: one bathroom, one bed, dinner and breakfast included",
  address: "Pamki Building, Kimathi way Nyeri down town",
  maxGuest: 2,
  pricePerNight: "1500.00",
};

const mockApproval: TIApproval = {
  approvedRoomNum: roomNumber,
  approvingHostId: "",
  approvedGuestId: "",
  roomAprovalStatus: "pending",
};

beforeAll(async () => {
  await db.delete(roomApprovalTable).where(eq(roomApprovalTable.approvedRoomNum, roomNumber));
  await db.delete(roomsTable).where(eq(roomsTable.roomNumber, roomNumber));
  await db.delete(guestsTable).where(eq(guestsTable.guestEmail, testGuest.guestEmail));
  await db.delete(hostAdminTable).where(eq(hostAdminTable.hostEmail, testHost.hostEmail));

  const hashedPass = bcrypt.hashSync(testHost.hostPasswordHash, 5);
  const [hostAdmin] = await db
    .insert(hostAdminTable)
    .values({
      ...testHost,
      hostPasswordHash: hashedPass,
      role: "hostAdmin",
    })
    .returning();
  hostAdminId = hostAdmin.hostAdminId;

  const [guest] = await db
    .insert(guestsTable)
    .values({
      ...testGuest,
      role: "guest",
      isVerified: true,
    })
    .returning();
  guestId = guest.guestId;

  await db.insert(roomsTable).values({ ...mockRoom, roomstatus: "vacant" });

  const loginRes = await request(app)
    .post("/auth/loginhost")
    .send({
      hostEmail: testHost.hostEmail,
      hostPasswordHash: testHost.hostPasswordHash,
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  await db.delete(roomApprovalTable).where(eq(roomApprovalTable.approvedRoomNum, roomNumber));
  await db.delete(roomsTable).where(eq(roomsTable.roomNumber, roomNumber));
  await db.delete(guestsTable).where(eq(guestsTable.guestEmail, testGuest.guestEmail));
  await db.delete(hostAdminTable).where(eq(hostAdminTable.hostEmail, testHost.hostEmail));
  await db.$client.end();
});

describe("approval controller integration", () => {
  it.skip("should create a new approval and return the created data", async () => {
    const res = await request(app)
      .post("/auth/approval/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...mockApproval,
        approvingHostId: hostAdminId,
        approvedGuestId: guestId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Approval generated and created");
    expect(res.body.data[0]).toMatchObject({
      approvedRoomNum: roomNumber,
      approvingHostId: hostAdminId,
      approvedGuestId: guestId,
      roomAprovalStatus: "pending",
    });
  });

  it("should return all approvals", async () => {
    const res = await request(app)
      .get("/auth/approvals")
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data", expect.any(Array));
  });

  it.skip("should get an approval by room number", async () => {
    const res = await request(app)
      .get(`/auth/approvals/approvalbyroomnum/${roomNumber}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it.skip("should get an approval by guest id", async () => {
    const res = await request(app)
      .get(`/auth/approvals/approvalbyguestid/${guestId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  });

  it.skip("should get approval by the host id", async ()=>{
    const hostAdminId = "gfhjk-89"
    const res = await request(app)
      .get(`/auth/approvals/approvalbyhostid/${hostAdminId}`)
      .set("Authorization", `Bearer ${token}`)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
  })
});