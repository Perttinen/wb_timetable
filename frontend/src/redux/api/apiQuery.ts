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

    if (result?.error?.status === 403 || result?.error?.status === 401) {
      const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);
      if (isRefreshResponse(refreshResult?.data)) {
        api.dispatch(setCredentials({ ...refreshResult.data }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        if (
          refreshResult?.error?.status === 403 ||
          getErrorMessage(refreshResult.error).includes("You have to login")
        ) {
          // console.log("rf: ", refreshResult);
          showErrorSnack(refreshResult.error);
          // console.log("return refresh error: ", {
          //   error: {
          //     ...refreshResult.error,
          //     data: { message: "Your login has expired." },
          //   },
          // });
          // return {
          //   error: {
          //     ...refreshResult.error,
          //     data: { message: "Your login has expired." },
          //   },
          // };
        }
        console.log("return if not refreshed: ", refreshResult);
        return refreshResult;
      }
    }

    // if ("error" in result && result.error) {
    //   const message = getErrorMessage(result.error);
    // if (message.includes("jwt expired")) {
    //   console.log("return jwt expired: ", {
    //     error: {
    //       ...result.error,
    //       data: { message: "Session expired. Please log in again." },
    //     },
    //   });

    //   return {
    //     error: {
    //       ...result.error,
    //       data: { message: "Session expired. Please log in again." },
    //     },
    //   };
    // }
    //   console.error(`Api error: ${message}`);
    //   showErrorSnack(result.error);

    //   console.log("return if session expired: ", { error: result.error });
    //   return { error: result.error };
    // }
    console.log(result);

    console.log("return result: ", { data: result.data });
    return result;
    // return { data: result.data };
  } catch (e) {
    console.log("catch");
    const message = getErrorMessage(e);
    console.error("Unexpected exception:", message);
    showErrorSnack(e);
    console.log("return unexpected: ", { error: e });
    return { error: e };
  }
};
