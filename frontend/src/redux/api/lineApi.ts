import { lineTypes } from "../../../../types";
import { api } from "./baseApi";

export const lineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLines: builder.query<lineTypes.TLineReturnable[], void>({
      query: () => ({
        url: "/line",
        method: "GET",
      }),
      providesTags: ["Lines"],
    }),
    getLine: builder.query<lineTypes.TLineReturnable, number>({
      query: (id) => ({
        url: `/line/${id}`,
        method: "GET",
      }),
      providesTags: ["Line"],
    }),
    addLine: builder.mutation<lineTypes.TLineReturnable, lineTypes.TLineToAdd>({
      query: (newLine) => ({
        url: "/line",
        method: "POST",
        body: newLine,
      }),
      invalidatesTags: ["Lines"],
    }),
    updateLine: builder.mutation<
      lineTypes.TLineReturnable,
      lineTypes.TUpdateLineArgs
    >({
      query: ({ id, body }) => ({
        url: `/line/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Lines", "Line", "Timetable"],
    }),
    deleteLine: builder.mutation<number, number>({
      query: (id) => ({
        url: `/line/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lines"],
    }),
  }),
});

export const {
  useAddLineMutation,
  useDeleteLineMutation,
  useGetLineQuery,
  useGetLinesQuery,
  useUpdateLineMutation,
} = lineApi;
