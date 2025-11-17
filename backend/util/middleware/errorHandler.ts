import { NextFunction, Request, Response } from "express";
import logger from "../logger";
import getStatusCode from "../getStatusCode";

const errorHandler = (
  error: Error & { statusCode?: number; name?: string },
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`${error.name} ${error.message}`);

  const status = getStatusCode(error.name) || 500;
  const message = error.message || "strange server error";
  const name = error.name || "Error";
  console.log("handler2: ", error.name, error.message);
  res.status(status).json({ error: { name, message } });

  next(error);
};

export default errorHandler;
