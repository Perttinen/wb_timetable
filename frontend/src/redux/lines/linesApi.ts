import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILineReturnable } from "../../../../types";

export const linesApi = createApi({
  reducerPath: "linesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/line",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLines: builder.query<ILineReturnable[], void>({
      query: () => "/",
    }),
  }),
});

export const { useGetLinesQuery } = linesApi;
