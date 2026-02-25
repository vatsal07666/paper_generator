import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'English' },
];

const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {}
});

export default subjectSlice.reducer;