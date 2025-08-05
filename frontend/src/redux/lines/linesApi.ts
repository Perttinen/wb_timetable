import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";
import { ILineReturnable, ILineToAdd } from "../../../../types";

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
    addLine: builder.mutation<ILineReturnable, ILineToAdd>({
      query: (newLine) => ({
        url: "/line",
        method: "POST",
        body: newLine,
      }),
    }),
  }),
});

export const { useGetLinesQuery, useAddLineMutation } = linesApi;
