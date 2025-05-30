import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";

dotenv.config();

console.log(process.env.NODE_ENV);

const sequelize: Sequelize =
  process.env.NODE_ENV === "dev"
    ? new Sequelize(
        String(process.env.DATABASE),
        String(process.env.DATABASEUSER),
        String(process.env.DATABASEPASSWORD),
        {
          host: process.env.HOST,
          dialect: "postgres",
          protocol: "postgres",
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          },
        }
      )
    : new Sequelize(process.env.LOCAL_DB!);

const connectToDatabase = async () => {
  await sequelize.authenticate();
  console.log("database connected");
  return null;
};

export default {
  connectToDatabase,
  sequelize,
};
