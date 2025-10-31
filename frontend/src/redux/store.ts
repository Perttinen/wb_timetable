import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./auth/loggedUserSlice";
import { loginApi } from "./auth/loginApi";
import { logout } from "./auth/logoutActions";
import { api } from "./api";

const appReducer = combineReducers({
  loggedUser: loggedUserReducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [api.reducerPath]: api.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: Action
) => {
  if (action.type === logout.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  devTools: process.env.NODE_ENV === "development" ? true : false,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware).concat(loginApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
