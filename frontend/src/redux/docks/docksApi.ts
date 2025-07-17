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
    deleteDock: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dock/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetDocksQuery, useDeleteDockMutation } = docksApi;
