import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";
import { IDockname } from "../../../../types";

interface IDock {
  id: number | null;
  name: string | null;
}

export const docksApi = createApi({
  reducerPath: "docksApi",
  baseQuery: apiQuery,
  tagTypes: ["Dock"],
  endpoints: (builder) => ({
    getDocks: builder.query<IDock[], void>({
      query: () => ({
        url: "/dock/",
        method: "GET",
      }),
      providesTags: ["Dock"],
    }),
    deleteDock: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dock/${id}`,
        method: "DELETE",
      }),
    }),
    addDock: builder.mutation<IDock, IDockname>({
      query: (newDock) => ({
        url: "/dock",
        method: "POST",
        body: newDock,
      }),
      invalidatesTags: ["Dock"],
    }),
    changeDock: builder.mutation<IDock, IDock>({
      query: (Dock) => ({
        url: "/dock",
        method: "PATCH",
        body: Dock,
      }),
      invalidatesTags: ["Dock"],
    }),

    getDock: builder.query<IDock, number>({
      query: (id) => ({
        url: `/dock/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetDocksQuery,
  useDeleteDockMutation,
  useAddDockMutation,
  useGetDockQuery,
  useChangeDockMutation,
} = docksApi;
