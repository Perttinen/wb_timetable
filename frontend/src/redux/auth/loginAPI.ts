import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IJsonUserFlattenedLevels } from "../../../../types";

interface ILoginResponse {
  user: IJsonUserFlattenedLevels;
  token: string;
}
interface ILoginRequest {
  username: string;
  password: string;
}

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
    login: builder.mutation<ILoginResponse, ILoginRequest>({
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
