import { Request, Response } from "express";
import { throwNotFound } from "../errorThrowers";

const unknownEndpoint = (_request: Request, _response: Response) => {
  throwNotFound("unknown endpoint");
};

export default unknownEndpoint;
