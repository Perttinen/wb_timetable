import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJsonUserFlattenedLevels } from "../../../../types";

const initialState: IJsonUserFlattenedLevels[] = [];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<IJsonUserFlattenedLevels[]>) => {
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

export const { setUsers } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
