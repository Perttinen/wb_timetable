import { Action, combineReducers, configureStore } from "@reduxjs/toolkit";
import { loggedUserReducer } from "./auth/loggedUserSlice";
import { loginApi } from "./auth/loginApi";
import { docksReducer } from "./docks/docksSlice";
import { docksApi } from "./docks/docksApi";
import { linesReducer } from "./lines/linesSlice";
import { linesApi } from "./lines/linesApi";
import { usersApi } from "./users/usersApi";
import { usersReducer } from "./users/usersSlice";
import { logout } from "./auth/logoutActions";

const appReducer = combineReducers({
  loggedUser: loggedUserReducer,
  docks: docksReducer,
  lines: linesReducer,
  users: usersReducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [docksApi.reducerPath]: docksApi.reducer,
  [linesApi.reducerPath]: linesApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
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
console.log(process.env.NODE_ENV);

export const store = configureStore({
  devTools: process.env.REDUX_TOOLS === "false" ? false : true,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(loginApi.middleware)
      .concat(docksApi.middleware)
      .concat(linesApi.middleware)
      .concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
