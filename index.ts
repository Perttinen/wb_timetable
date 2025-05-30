import startServer from "./backend/util/startServer";
import db from "./backend/util/db";

db.connectToDatabase().catch((e) => {
  if (e instanceof Error) {
    console.log(`Unable to connect database: ${e.message}`);
  }
});

startServer();
