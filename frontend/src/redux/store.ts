import { configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./auth/loggedUserSlice";
import { loginApi } from "./auth/loginAPI";

export const store = configureStore({
  reducer: {
    loggedUser: loggedUserReducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loginApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
