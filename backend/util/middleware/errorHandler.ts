import { NextFunction, Request, Response } from "express";
import logger from "../logger";

const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.log("erroriiii");

  logger.error(error.message);

  if (error.name === "CastError") {
    response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

export default errorHandler;
