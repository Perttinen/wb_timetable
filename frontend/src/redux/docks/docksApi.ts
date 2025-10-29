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
  tagTypes: ["Dock", "Timetable"],
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
    addDock: builder.mutation<IDock, IDockname>({
      query: (newDock) => ({
        url: "/dock",
        method: "POST",
        body: newDock,
      }),
    }),
    changeDock: builder.mutation<IDock, IDock>({
      query: (Dock) => ({
        url: "/dock",
        method: "PATCH",
        body: Dock,
      }),
      invalidatesTags: (result, error, dock) => [
        { type: "Timetable", id: dock.id ?? undefined },
        { type: "Dock", id: dock.id ?? undefined },
      ],
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
