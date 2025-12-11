import { userlevelTypes } from "../../../../types"
import { api } from "./baseApi"

export const userlevelApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserlevels: builder.query<userlevelTypes.TUserlevel[], void>({
      query: () => ({ url: "/userlevel", method: "GET" }),
    }),
  }),
})

export const { useGetUserlevelsQuery } = userlevelApi
