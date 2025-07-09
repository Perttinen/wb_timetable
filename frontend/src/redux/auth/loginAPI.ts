import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IJsonUserFlattenedLevels } from "../../../../types";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { user: IJsonUserFlattenedLevels; token: string },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
