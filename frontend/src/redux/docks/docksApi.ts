import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IDock {
  id: number | null;
  name: string | null;
}

export const docksApi = createApi({
  reducerPath: "docksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/dock",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDocks: builder.query<IDock[], void>({
      query: () => "/",
    }),
  }),
});

export const { useGetDocksQuery } = docksApi;
