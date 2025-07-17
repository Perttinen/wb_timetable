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
    deleteDock: (state, action: PayloadAction<number>) => {
      return state.filter((dock) => dock.id !== action.payload);
    },
  },
});

export const { setDocks, deleteDock } = docksSlice.actions;
export const docksReducer = docksSlice.reducer;
