import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";
import { ILineReturnable } from "../../../../types";

export const linesApi = createApi({
  reducerPath: "linesApi",
  baseQuery: apiQuery,
  endpoints: (builder) => ({
    getLines: builder.query<ILineReturnable[], void>({
      query: () => ({
        url: "/line",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLinesQuery } = linesApi;
