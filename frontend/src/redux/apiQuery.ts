import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { getErrorMessage } from "../utils/getErrorMessage";
import { showSnackbar } from "../components/SnackbarProvider";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers) => {
    const skipAuth = headers.get("X-Skip-Auth") === "true";

    if (!skipAuth) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

export const apiQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  try {
    const result = await baseQuery(args, api, extraOptions);

    if ("error" in result && result.error) {
      const message = getErrorMessage(result.error);
      const isSerializedError = (
        err: unknown
      ): err is { name?: string; message?: string } =>
        typeof err === "object" && err !== null && "name" in err;

      if (
        isSerializedError(result.error) &&
        result.error.name === "AbortError"
      ) {
        console.debug("Request aborted:", message);
        return { error: result.error, aborted: true };
      }
      console.error(`Api error: ${message}`);

      showSnackbar({
        message,
        severity: "error",
        duration: 10000,
      });
      if (message.includes("jwt expired") || message.includes("Unauthorized")) {
        window.location.href = "/";
        showSnackbar({
          message,
          severity: "error",
          duration: 10000,
        });
      }
      return { error: result.error };
    }
    return { data: result.data };
  } catch (e) {
    const message = getErrorMessage(e);
    console.error("Unexpected exception:", message);
    showSnackbar({ message, severity: "error", duration: 10000 });
    return { error: e };
  }
};
