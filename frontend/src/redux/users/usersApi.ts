import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";
import { IJsonUserFlattenedLevels } from "../../../../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: apiQuery,
  endpoints: (builder) => ({
    getUsers: builder.query<IJsonUserFlattenedLevels[], void>({
      query: () => ({ url: "/user", method: "GET" }),
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
