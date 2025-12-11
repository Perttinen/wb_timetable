import { departureTypes } from "../../../../types"
import { api } from "./baseApi"

export const departureApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTimetable: builder.query<
      departureTypes.TDepartureForTimetable[],
      string
    >({
      query: (dockId) => ({
        url: `/departure/timetable/${dockId}`,
        method: "GET",
      }),
      providesTags: ["Timetable"],
    }),

    addDeparture: builder.mutation<
      departureTypes.TDeparture,
      departureTypes.TInputDeparture
    >({
      query: (addDeparture) => ({
        url: "/departure/addOne",
        method: "POST",
        body: addDeparture,
      }),
      invalidatesTags: ["Timetable"],
    }),

    addManyDepartures: builder.mutation<
      departureTypes.TDeparture[],
      departureTypes.TInputDeparture[]
    >({
      query: (addManyDepartures) => ({
        url: "/departure/addMany",
        method: "POST",
        body: addManyDepartures,
      }),
      invalidatesTags: ["Timetable"],
    }),

    deleteDepartures: builder.mutation<
      void,
      departureTypes.TDeleteDeparturesPayload
    >({
      query: (deleteManyDepartures) => ({
        url: "/departure/deletemany",
        method: "DELETE",
        body: deleteManyDepartures,
      }),
      invalidatesTags: ["Timetable"],
    }),
  }),
})

export const {
  useAddDepartureMutation,
  useAddManyDeparturesMutation,
  useDeleteDeparturesMutation,
  useGetTimetableQuery,
} = departureApi
