import startServer from "./backend/util/startServer";
import db from "./backend/util/db";

const connect = async () => {
  await db.connectToDatabase();
  startServer();
};
// db.connectToDatabase().catch((e) => {
//   if (e instanceof Error) {
//     console.log(`Unable to connect database: ${e.message}`);
//   }
// });
connect();
