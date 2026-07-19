import request from "supertest"
import bcrypt from "bcryptjs"
import db from "../../src/Drizzle/db"
import { hostAdminTable } from "../../src/Drizzle/schema"
import {app} from "../../src/server"
import { eq } from "drizzle-orm"
// import { describe, expect, it } from "@jest/globals"
import { createHostController } from "../../src/auth/auth.controller"
import { except } from "drizzle-orm/pg-core"

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
    .where(eq(hostAdminTable.hostEmail, testHost.hostEmail))
    await db.$client.end()
  })


  describe("post, login", ()=>{
    it("should login a host and return a token", async () => {
     const res = await request(app)
      .post("/auth/loginhost")
      .send({
        hostEmail: testHost.hostEmail,
        hostPasswordHash: testHost.hostPasswordHash
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty("token")
      expect(res.body.user).toEqual(
        expect.objectContaining({
            "user-id": expect.any(Number),
            "fist-name": testUser.firstName,
            "last-name": testUser.lastName,
        })
      )
    })
  })

