import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "../apiQuery";
import { IDepartureForTimetable } from "../../../../types";

export const timetableApi = createApi({
  reducerPath: "timetableApi",
  baseQuery: apiQuery,
  endpoints: (builder) => ({
    getTimetable: builder.query<IDepartureForTimetable[], string>({
      query: (dockName) => ({
        url: `/departure/timetable/${dockName}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTimetableQuery } = timetableApi;
