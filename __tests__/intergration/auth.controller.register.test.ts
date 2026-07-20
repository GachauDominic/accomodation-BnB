import bcrypt from "bcryptjs";
import db from "../../src/Drizzle/db";
import { hostAdminTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import request from "supertest";
import app from "../../src/server";


let testHost = {
  firstName: "Dominic",
  lastName: "test",
  hostEmail: "testuser@example.com",
  hostContact: "0712346748",
  hostPasswordHash: "password123"
}

afterAll( async () => {
 await db.delete(hostAdminTable)
 .where(eq(hostAdminTable.hostEmail, testHost.hostEmail));
 await db.$client.end()
})


describe('post register host', ()=>{
  it("should register a host and return their data along with a success message", async () => {
    const res = await request(app)
    .post('/auth/register')
    .send({
      ...testHost,
      hostPasswordHash: await bcrypt.hashSync(testHost.hostPasswordHash, 5)
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({"message": "Host created successfully", "data": expect.anything() })
  })

  it("should not register an already exting email", async () => {
    const res = await request(app)
    .post('/auth/register')
    .send({
      ...testHost, 
      hostPasswordHash: await bcrypt.hashSync(testHost.hostPasswordHash, 5)
    })
    
    expect(res.statusCode).toBe(500)
    expect(res.body).toHaveProperty('error')
    
  })

  it("should not register with missing fields", async () => {
    const res = await request(app)
    .post('/auth/register')
    .send({
      firstName: "Dominic",
      lastName: "test",
      hostEmail: "testuser@example.com",
      hostContact: "0712346748",
    })
    
    expect(res.statusCode).toBe(500)
    expect(res.body).toHaveProperty('error')
    
  })
})