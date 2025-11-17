import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development" ? true : false,
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
