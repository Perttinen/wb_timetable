import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILineReturnable } from "../../../../types";

const initialState: ILineReturnable[] = [];

const linesSlice = createSlice({
  name: "lines",
  initialState,
  reducers: {
    setLines: (state, action: PayloadAction<ILineReturnable[]>) => {
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

export const { setLines } = linesSlice.actions;
export const linesReducer = linesSlice.reducer;
