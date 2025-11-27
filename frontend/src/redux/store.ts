import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { api } from "./api/baseApi";

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development" ? true : false,
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
