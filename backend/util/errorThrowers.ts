export const throwNotFound = (message: string) => {
  const error = new Error(message);
  error.name = "NotFound";
  throw error;
};

export const throwAuthError = (message: string): never => {
  const error = new Error(message);
  error.name = "AuthError";
  throw error;
};
