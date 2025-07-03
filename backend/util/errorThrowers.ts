export const throwNotFound = (message: string) => {
  const error = new Error(message);
  error.name = "NotFoundError";
  throw error;
};

export const throwAuthError = (message: string): never => {
  const error = new Error(message);
  error.name = "AuthError";
  throw error;
};

export const throwValidationError = (message: string): never => {
  const error = new Error(message);
  error.name = "ValidationError";
  throw error;
};
