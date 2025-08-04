import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDepartureForTimetable } from "../../../../types";

const initialState: IDepartureForTimetable[] = [];

const timetableSlice = createSlice({
  name: "timetable",
  initialState,
  reducers: {
    setTimetable: (state, action: PayloadAction<IDepartureForTimetable[]>) => {
      state.length = 0;
      state.push(...action.payload);
    },
    // deleteDock: (state, action: PayloadAction<number>) => {
    //   return state.filter((dock) => dock.id !== action.payload);
    // },
  },
});

export const { setTimetable } = timetableSlice.actions;
export const timetableReducer = timetableSlice.reducer;
