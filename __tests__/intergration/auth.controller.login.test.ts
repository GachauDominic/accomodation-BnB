import request from "supertest"
import bcrypt from "bcryptjs"
import db from "../../src/Drizzle/db"
import { hostAdminTable } from "../../src/Drizzle/schema"
import app from "../../src/server"
import { eq } from "drizzle-orm"

let testHost = {
  firstName: "Dominic",
  lastName: "test",
  hostEmail: "testuser@example.com",
  hostContact: "0712346748",
  hostPasswordHash: "password123"
}

  beforeAll(async() => {
    const hashedpass = bcrypt.hashSync(testHost.hostPasswordHash, 5)
    await db.insert(hostAdminTable).values({
      ...testHost,
      hostPasswordHash: hashedpass
    })
  })

  afterAll(async() => {
    await db.delete(hostAdminTable)
    .where(eq(hostAdminTable.hostEmail, testHost.hostEmail));
    await db.$client.end()
  })

  describe.skip("post, login", ()=>{
    it("should login a host and return a token", async () => {
     const res = await request(app)
      .post("/auth/loginhost")
      .send({
        hostEmail: "testuser@example.com",
        hostPasswordHash: "password123"
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty("token")
      expect(res.body.host).toEqual(
        expect.objectContaining({
          "hostAdminId": expect.anything(),
          "firstName": testHost.firstName,
          "lastName": testHost.lastName,
        })
      )
    })

    // wrong password testing
    it("should return invalid credetials if password is wrong", async () => {
      const res = await request(app)
      .post("/auth/loginhost")
      .send({
        hostEmail: "testuser@example.com",
        hostPasswordHash: "wrongpass"
      })

      expect(res.statusCode).toBe(401)
      expect(res.body).toEqual({message : "Invalid credentials"})

    })

    // wrong email
    it("should return host not found", async () => {
      const res = await request(app)
      .post("/auth/loginhost")
      .send({
        hostEmail: "wrongemail@example.com",
        hostPasswordHash: "password123"
      })

      expect(res.statusCode).toBe(404)
      expect(res.body).toEqual({message: "Host not found"})
    })
    
  })

