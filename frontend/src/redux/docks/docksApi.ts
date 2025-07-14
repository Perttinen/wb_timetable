import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";

interface IDock {
  id: number | null;
  name: string | null;
}

export const docksApi = createApi({
  reducerPath: "docksApi",
  baseQuery: apiQuery,
  endpoints: (builder) => ({
    getDocks: builder.query<IDock[], void>({
      query: () => ({
        url: "/dock/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDocksQuery } = docksApi;
