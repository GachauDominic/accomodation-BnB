import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema"
export const client = new Client({
  connectionString: process.env.Database_URL as string,
})
const main = async ()=>{
  await client.connect();
}
main().then(()=>{
  console.log("Connected to the DataBase")
}).catch((error)=>{
  console.error("Eroor connecting to the DataBase", error);
});
const db = drizzle(client, { schema, logger: true });
export default db;


// Neon Serverless 1
// import "dotenv/config";
// import { drizzle } from "drizzle-orm/neon-http";
// import { Client } from "pg";
// import { neon } from "@neondatabase/serverless";
// import * as schema from "./schema"
// export const client = neon(process.env.Database_URL!)
// const db = drizzle(client, {schema, logger: true});
// export default db;