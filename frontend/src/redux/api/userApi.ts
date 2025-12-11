import { api } from "./baseApi";
import { userTypes } from "../../../../types";

interface IUpdateUserArgs {
  id: string;
  body: userTypes.TUpdateUserRequest;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<userTypes.TUserSafe[], void>({
      query: () => ({ url: "/user", method: "GET" }),
      providesTags: ["Users"],
    }),

    getUser: builder.query<userTypes.TUserSafe, string>({
      query: (userId) => ({ url: `/user/${userId}`, method: "GET" }),
      providesTags: ["User"],
    }),

    addUser: builder.mutation<userTypes.TUserSafe, userTypes.TNewUserRequest>({
      query: (newUser) => ({
        url: "/user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<userTypes.TUserSafe, IUpdateUserArgs>({
      query: ({ id, body }) => {
        return {
          url: `/user/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Users", "User"],
    }),

    deleteUser: builder.mutation<number, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userApi;
