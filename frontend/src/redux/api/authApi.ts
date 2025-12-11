import { api } from "./baseApi"
import { logOut, setCredentials } from "../authSlice"
import { authTypes, userTypes } from "../../../../types"

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<authTypes.TLoginResponse, authTypes.TLoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      onQueryStarted(arg, { dispatch }) {
        dispatch(logOut())
        dispatch(api.util.resetApiState())
      },
    }),

    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({ url: "/auth/refresh", method: "GET" }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled
        dispatch(setCredentials({ accessToken: data.accessToken }))
      },
    }),

    getMe: builder.query<userTypes.TUserSafe, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),

    checkPassword: builder.mutation<boolean, { password: string }>({
      query: (pw) => ({
        url: "/auth/checkpw",
        method: "POST",
        body: pw,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetMeQuery,
  useCheckPasswordMutation,
} = authApi
