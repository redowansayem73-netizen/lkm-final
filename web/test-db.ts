const dotenv = require("dotenv");
dotenv.config();
const { db } = require("./src/db");
const { admins } = require("./src/db/schema");

async function main() {
  try {
    const allAdmins = await db.select().from(admins);
    console.log("Admins:");
    console.log(allAdmins);
    process.exit(0);
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
}

main();
