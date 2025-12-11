import { api } from "./baseApi"
import { dockTypes } from "../../../../types"

export const dockApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocks: builder.query<dockTypes.TDock[], void>({
      query: () => ({ url: "/dock/", method: "GET" }),
      providesTags: ["GetDocks"],
    }),

    getDock: builder.query<dockTypes.TDock, number>({
      query: (id) => ({ url: `/dock/${id}`, method: "GET" }),
      providesTags: ["GetDock"],
    }),

    addDock: builder.mutation<dockTypes.TDock, { name: string }>({
      query: (newDock) => ({ url: "/dock", method: "POST", body: newDock }),
      invalidatesTags: ["GetDocks"],
    }),

    changeDock: builder.mutation<dockTypes.TDock, dockTypes.TDock>({
      query: (dock) => ({ url: "/dock", method: "PATCH", body: dock }),
      invalidatesTags: ["GetDocks", "GetDock", "Timetable", "Lines"],
    }),

    deleteDock: builder.mutation<number, number>({
      query: (id) => ({ url: `/dock/${id}`, method: "DELETE" }),
      invalidatesTags: ["GetDocks"],
    }),
  }),
})

export const {
  useGetDocksQuery,
  useGetDockQuery,
  useAddDockMutation,
  useChangeDockMutation,
  useDeleteDockMutation,
} = dockApi
