const getStatusCode = (errorName: string) => {
  const errorStatusMap: {
    set: (arg0: string, arg1: number) => void;
    get: (arg0: string) => number;
  } = new Map();

  errorStatusMap.set("CastError", 400);
  errorStatusMap.set("SequelizeUniqueConstraintError", 422);
  errorStatusMap.set("ValidationError", 422);
  errorStatusMap.set("NotFoundError", 404);
  errorStatusMap.set("JsonWebTokenError", 401);
  errorStatusMap.set("AuthError", 401);
  errorStatusMap.set("SequelizeValidationError", 422);

  return errorStatusMap.get(errorName);
};

export default getStatusCode;
