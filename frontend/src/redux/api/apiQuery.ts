import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { selectCurrentToken, setCredentials } from "../authSlice";
import { RootState } from "../store";
import { getErrorMessage } from "../../utils/getErrorMessage";
import showErrorSnack from "../../utils/showErrorSnack";

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
    if (
      result?.error?.status === 403 ||
      getErrorMessage(result.error) === "token missing"
    ) {
      const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
      if (isRefreshResponse(refreshResult?.data)) {
        api.dispatch(setCredentials({ ...refreshResult.data }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        if (
          refreshResult?.error?.status === 403 ||
          getErrorMessage(refreshResult.error).includes("You have to login")
        ) {
          showErrorSnack(refreshResult.error);
        }
        return refreshResult;
      }
    }
    console.log(result);

    return result;
  } catch (e) {
    console.error("Unexpected exception:", getErrorMessage(e));
    showErrorSnack(e);
    return { error: e };
  }
};
