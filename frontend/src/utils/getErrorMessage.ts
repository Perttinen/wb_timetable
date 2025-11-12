import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface IErrorWithMessage {
  error?: {
    message?: string;
  };
}

export const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as FetchBaseQueryError).data === "object"
  ) {
    const data = (error as FetchBaseQueryError).data as IErrorWithMessage;
    return data?.error?.message || "Unexpected exception";
  }
  console.error("Unexpected exception: ", error);

  return "Unexpected exception";
};
