import db from "./db"

db.rollbackMigration().catch((e) => {
  if (e instanceof Error) {
    console.log(`Unable to rollback: ${e.message}`)
  }
})
