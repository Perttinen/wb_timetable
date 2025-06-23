import startServer from "./backend/util/startServer";
import db from "./backend/util/db";

const start = async () => {
  await db.connectToDatabase();
  startServer();
};

start().catch((e) => {
  if (e instanceof Error) {
    console.log(`Unable to start: ${e.message}`);
  }
});
