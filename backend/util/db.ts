import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { Umzug, SequelizeStorage } from "umzug";

dotenv.config();

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
    : new Sequelize(String(process.env.LOCAL_DB));

const connectToDatabase = async () => {
  await sequelize.authenticate();
  await runMigrations();
  console.log("database connected");
  return null;
};

const migrationConf = {
  migrations: {
    glob: "database/migrations/*.ts",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

export default {
  connectToDatabase,
  sequelize,
};
