import { SerializedError } from "@reduxjs/toolkit"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

interface IErrorWithMessage {
  error?: {
    message?: string
  }
}

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    "data" in error
  )
}

const isSerializedError = (error: unknown): error is SerializedError => {
  return typeof error === "object" && error !== null && "message" in error
}

export const getErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    const data = error.data as IErrorWithMessage
    return data?.error?.message || "Unexpected exception"
  }

  if (isSerializedError(error)) {
    return error.message || "Unexpected exception"
  }

  return "Unexpected exception"
}
