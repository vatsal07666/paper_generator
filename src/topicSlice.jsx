import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  1: [ { id: 1, name: 'Algebra' }, { id: 2, name: 'Geometry' } ],
  2: [ { id: 3, name: 'Physics' }, { id: 4, name: 'Chemistry' } ],
  3: [ { id: 5, name: 'Grammar' }, { id: 6, name: 'Literature' } ]
};

const topicSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {}
});

export default topicSlice.reducer;