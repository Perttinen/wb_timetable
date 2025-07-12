import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IDock {
  id: number | null;
  name: string | null;
}

const initialState: IDock[] = [];

const docksSlice = createSlice({
  name: "docks",
  initialState,
  reducers: {
    setDocks: (state, action: PayloadAction<IDock[]>) => {
      state.length = 0;
      state.push(...action.payload);
    },
  },
});

export const { setDocks } = docksSlice.actions;
export const docksReducer = docksSlice.reducer;
