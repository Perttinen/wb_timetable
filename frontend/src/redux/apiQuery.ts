import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { getErrorMessage } from "../utils/getErrorMessage";
import { showSnackbar } from "../components/SnackbarProvider";
import { setCredentials } from "./authSlice";
import { RootState } from "./store";
import { selectCurrentToken } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = selectCurrentToken(getState() as RootState);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

type RefreshResponse = {
  accessToken: string;
};

const isRefreshResponse = (data: unknown): data is RefreshResponse => {
  return typeof data === "object" && data !== null && "accessToken" in data;
};

export const apiQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  try {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403 || result?.error?.status === 401) {
      const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

      if (isRefreshResponse(refreshResult?.data)) {
        api.dispatch(setCredentials({ ...refreshResult.data }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        if (refreshResult?.error?.status === 403) {
          return {
            error: {
              ...refreshResult.error,
              data: { message: "Your login has expired." },
            },
          };
        }
        return refreshResult;
      }
    }

    if ("error" in result && result.error) {
      const message = getErrorMessage(result.error);
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
