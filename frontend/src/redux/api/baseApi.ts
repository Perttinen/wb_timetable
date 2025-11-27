import { createApi } from "@reduxjs/toolkit/query/react";
import { apiQuery } from "./apiQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery: apiQuery,
  tagTypes: [
    "GetDocks",
    "GetDock",
    "Timetable",
    "Lines",
    "Line",
    "Users",
    "User",
    "Me",
  ],
  endpoints: () => ({}),
});
