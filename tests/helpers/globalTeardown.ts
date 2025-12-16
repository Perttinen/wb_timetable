import db from "../../database/db"

export default async () => {
  console.log("Global Teardown: Closing database connection...")

  await db.closeDatabase()

  console.log("Global Teardown: Database connection closed.")
}
