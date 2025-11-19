import { createApi } from "@reduxjs/toolkit/query/react";
import {
  IDeleteDeparturesPayload,
  IDeparture,
  IDepartureForTimetable,
  IDockname,
  IInputDeparture,
  IJsonUserFlattenedLevels,
  ILineReturnable,
  ILineToAdd,
  ILoginRequest,
  ILoginResponse,
  INewUserRequest,
  IUpdateLineArgs,
  IUpdateUserArgs,
  IUserlevel,
} from "../../../types";
import { apiQuery } from "./apiQuery";

interface IDock {
  id: number | null;
  name: string | null;
}

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
  endpoints: (builder) => ({
    // DOCK
    getDocks: builder.query<IDock[], void>({
      query: () => ({
        url: "/dock/",
        method: "GET",
      }),
      providesTags: ["GetDocks"],
    }),
    deleteDock: builder.mutation<number, number>({
      query: (id) => ({
        url: `/dock/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GetDocks"],
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
      invalidatesTags: ["GetDocks", "GetDock", "Timetable", "Lines"],
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
    deleteDepartures: builder.mutation<void, IDeleteDeparturesPayload>({
      query: (deleteManyDepartures) => ({
        url: "/departure/deletemany",
        method: "DELETE",
        body: deleteManyDepartures,
      }),
      invalidatesTags: ["Timetable"],
    }),
    //LINE
    getLines: builder.query<ILineReturnable[], void>({
      query: () => ({
        url: "/line",
        method: "GET",
      }),
      providesTags: ["Lines"],
    }),
    getLine: builder.query<ILineReturnable, number>({
      query: (id) => ({
        url: `/line/${id}`,
        method: "GET",
      }),
      providesTags: ["Line"],
    }),
    addLine: builder.mutation<ILineReturnable, ILineToAdd>({
      query: (newLine) => ({
        url: "/line",
        method: "POST",
        body: newLine,
      }),
      invalidatesTags: ["Lines"],
    }),

    updateLine: builder.mutation<ILineReturnable, IUpdateLineArgs>({
      query: ({ id, body }) => ({
        url: `/line/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Lines", "Line", "Timetable"],
    }),

    //USER
    getUsers: builder.query<IJsonUserFlattenedLevels[], void>({
      query: () => ({ url: "/user", method: "GET" }),
      providesTags: ["Users"],
    }),
    getUser: builder.query<IJsonUserFlattenedLevels, string>({
      query: (userId) => ({ url: `/user/${userId}`, method: "GET" }),
      providesTags: ["User"],
    }),
    addUser: builder.mutation<IJsonUserFlattenedLevels, INewUserRequest>({
      query: (newUser) => ({
        url: "/user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<IJsonUserFlattenedLevels, IUpdateUserArgs>({
      query: ({ id, body }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Users", "User"],
    }),
    deleteUser: builder.mutation<number, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    //USERLEVEL
    getUserlevels: builder.query<IUserlevel[], void>({
      query: () => ({ url: "/userlevel", method: "GET" }),
      // providesTags: ["Users"],
    }),
    //LOGIN
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        invalidatesTags: ["Me"],
      }),
    }),
    getMe: builder.query<IJsonUserFlattenedLevels, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
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
  useDeleteDeparturesMutation,
  useAddLineMutation,
  useGetLinesQuery,
  useGetLineQuery,
  useUpdateLineMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useGetUserlevelsQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
  useGetMeQuery,
} = api;
