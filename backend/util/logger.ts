import chalk from "chalk";

const info = (...params: unknown[]) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(chalk.blue(...params));
  }
};

const error = (...params: unknown[]) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(chalk.bgRed.white(...params));
  }
};

export default {
  info,
  error,
};
