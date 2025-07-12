import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IJsonUserFlattenedLevels } from "../../../../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/user",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<IJsonUserFlattenedLevels[], void>({
      query: () => "/",
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
