import { NextFunction, Request, Response } from "express";
import logger from "../logger";

const errorHandler = (
  error: Error & { statusCode?: number; name?: string },
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`${error.name} ${error.message}`);

  let status = 500;
  let message = "strange server error";

  if (error.name === "CastError") {
    status = 400;
    message = "malformatted id";
  } else if (error.name === "ValidationError") {
    status = 400;
    message = error.message;
  } else if (error.name === "NotFound") {
    status = 404;
    message = error.message;
  } else if (error.name === "JsonWebTokenError") {
    status = 401;
    message = "invalid token";
  } else if (error.name === "TokenExpiredError") {
    status = 401;
    message = "Token expired";
  } else if (error.name === "AuthError") {
    status = 401;
    message = error.message;
  } else if (error.statusCode) {
    status = error.statusCode;
    message = error.message;
  }

  res.status(status).json({ error: message });

  next(error);
};

export default errorHandler;
