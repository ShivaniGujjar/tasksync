import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoardData: (state, action) => {
      state.data = action.payload;
    },
    clearBoardData: (state) => {
      state.data = null;
    },
  },
});

export const { setBoardData, clearBoardData } = boardSlice.actions;
export default boardSlice.reducer;