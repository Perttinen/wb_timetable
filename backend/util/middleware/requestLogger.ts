import { NextFunction, Request, Response } from "express";
import logger from "../logger";

const requestLogger = (
  request: Request,
  _response: Response,
  next: NextFunction
) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.url);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

export default requestLogger;
