import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IJsonUserFlattenedLevels } from "../../../../types";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
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
    getMe: builder.query<IJsonUserFlattenedLevels, void>({
      query: () => "/me",
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery } = loginApi;
