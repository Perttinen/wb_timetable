import dotenv from "dotenv";
import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { Umzug, SequelizeStorage } from "umzug";
import chalk from "chalk";

dotenv.config();

const sequelize: Sequelize =
  process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test"
    ? (console.log("dev database"),
      new Sequelize({
        url: String(process.env.DB),
        dialect: PostgresDialect,
        ssl: true,
        logging:
          process.env.NODE_ENV === "test"
            ? false
            : (msg) => console.log(chalk.magentaBright(msg)),
      }))
    : (console.log("prod database"),
      new Sequelize({
        url: String(process.env.LOCAL_DB),
        dialect: PostgresDialect,
      }));

const connectToDatabase = async () => {
  await sequelize.authenticate();
  await runMigrations();
  console.log("✅ Database connected");
  return null;
};

const migrationConf = {
  migrations: {
    glob: "database/migrations/*.ts",
  },
  storage: new SequelizeStorage({ sequelize, tableName: "migrations" }),
  context: sequelize.queryInterface,
  logger: console,
};
const migrator = new Umzug(migrationConf);
const runMigrations = async () => {
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  console.log(await sequelize.authenticate());
  console.log("rolling");
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

export type Migration = typeof migrator._types.migration;

export default {
  connectToDatabase,
  sequelize,
  rollbackMigration,
};
