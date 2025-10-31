import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { showSnackbar } from "../components/snackbarProvider";

interface IServerError {
  error: {
    name: string;
    message: string;
  };
}

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
  const result = await baseQuery(args, api, extraOptions);

  if ("error" in result && result.error) {
    const { data, status } = result.error;
    const errorData = data as IServerError;
    const name = errorData?.error?.name || "Error";
    const message = errorData?.error?.message || "Unexpected server error";
    console.error(`[${status}] ${name}: ${message}`);
    showSnackbar(`${name}: ${message}`);
  }

  return result;
};
