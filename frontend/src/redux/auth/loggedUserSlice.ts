import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJsonUserFlattenedLevels } from "../../../../types";

interface ICredentialsPayload {
  user: IJsonUserFlattenedLevels;
  token: string;
}

const initialState = {
  user: null as null | {
    id: number;
    username: string;
    userlevels: string[];
    disabled: boolean;
  },
  token: null as string | null,
};

const loggedUserSlice = createSlice({
  name: "loggedUser",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<ICredentialsPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = loggedUserSlice.actions;
export const loggedUserReducer = loggedUserSlice.reducer;
