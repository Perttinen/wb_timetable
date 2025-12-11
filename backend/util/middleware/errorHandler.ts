import { NextFunction, Request, Response } from "express";
import logger from "../logger";
import getStatusCode from "../getStatusCode";

const errorHandler = (
  error: Error & { statusCode?: number; name?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`${getStatusCode(error.name)} ${error}`);
  const status = getStatusCode(error.name) || 500;
  const message = error.message || "strange server error";
  const name = error.name || "Error";
  res.status(status).json({ error: { name, message } });
};

export default errorHandler;
