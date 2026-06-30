import "dotenv/config";
import { defineConfig } from "drizzle-kit" 

// import type { Config } from "drizzle-kit";

declare const process: {
  env: {
    Database_URL: string;
  };
};

export default defineConfig({
  dialect: "postgresql", //specifies the SQL in use
  schema: "./src/Drizzle/schema.ts", //path to the schema file
  out: "./src/Drizzle/migrations", // path to the migration file where first runnig it autogenerates
  dbCredentials: { //DB connection details
    url: process.env.Database_URL as string
  },
  verbose: true, //enables detailed logs
  strict: true //enables strict mode for type safety i.e throwing errors if any issues with the shema arise
})