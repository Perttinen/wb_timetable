import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";
import { IDepartureForTimetable } from "../../../../types";

export const timetableApi = createApi({
  reducerPath: "timetableApi",
  baseQuery: apiQuery,
  endpoints: (builder) => ({
    getTimetable: builder.query<IDepartureForTimetable[], string>({
      query: (dockId) => ({
        url: `/departure/timetable/${dockId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTimetableQuery } = timetableApi;
