import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeparture,
  IDepartureForTimetable,
  IDockname,
  IInputDeparture,
  IJsonUserFlattenedLevels,
  ILineReturnable,
  ILineToAdd,
} from "../../../types";
import { apiQuery } from "./apiQuery";

interface IDock {
  id: number | null;
  name: string | null;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: apiQuery,
  tagTypes: ["GetDocks", "GetDock", "Timetable"],
  endpoints: (builder) => ({
    // DOCK
    getDocks: builder.query<IDock[], void>({
      query: () => ({
        url: "/dock/",
        method: "GET",
      }),
      providesTags: ["GetDocks"],
    }),
    deleteDock: builder.mutation<void, number>({
      query: (id) => ({
        url: `/dock/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GetDocks", "Timetable"],
    }),
    addDock: builder.mutation<IDock, IDockname>({
      query: (newDock) => ({
        url: "/dock",
        method: "POST",
        body: newDock,
      }),
      invalidatesTags: ["GetDocks"],
    }),
    changeDock: builder.mutation<IDock, IDock>({
      query: (Dock) => ({
        url: "/dock",
        method: "PATCH",
        body: Dock,
      }),
      invalidatesTags: ["GetDocks", "GetDock", "Timetable"],
    }),

    getDock: builder.query<IDock, number>({
      query: (id) => ({
        url: `/dock/${id}`,
        method: "GET",
      }),
      providesTags: ["GetDock"],
    }),
    //DEPARTURE
    getTimetable: builder.query<IDepartureForTimetable[], string>({
      query: (dockId) => ({
        url: `/departure/timetable/${dockId}`,
        method: "GET",
      }),
      providesTags: ["Timetable"],
    }),
    addDeparture: builder.mutation<IDeparture, IInputDeparture>({
      query: (addDeparture) => ({
        url: "/departure/addOne",
        method: "POST",
        body: addDeparture,
      }),
      invalidatesTags: ["Timetable"],
    }),
    addManyDepartures: builder.mutation<IDeparture[], IInputDeparture[]>({
      query: (addManyDepartures) => ({
        url: "/departure/addMany",
        method: "POST",
        body: addManyDepartures,
      }),
      invalidatesTags: ["Timetable"],
    }),
    //LINE
    getLines: builder.query<ILineReturnable[], void>({
      query: () => ({
        url: "/line",
        method: "GET",
      }),
    }),
    getLine: builder.query<ILineReturnable, number>({
      query: (id) => ({
        url: `/line/${id}`,
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
    //USER
    getUsers: builder.query<IJsonUserFlattenedLevels[], void>({
      query: () => ({ url: "/user", method: "GET" }),
    }),
  }),
});

export const {
  useGetDocksQuery,
  useDeleteDockMutation,
  useAddDockMutation,
  useGetDockQuery,
  useChangeDockMutation,
  useGetTimetableQuery,
  useAddDepartureMutation,
  useAddManyDeparturesMutation,
  useAddLineMutation,
  useGetLinesQuery,
  useGetLineQuery,
  useGetUsersQuery,
} = api;
