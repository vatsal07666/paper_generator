import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  1: [ { id: 1, text: 'Solve x + 5 = 10' }, { id: 2, text: 'Factorize x^2 + 5x + 6' } ],
  2: [ { id: 3, text: 'Find area of triangle' } ],
  3: [ { id: 4, text: 'Newton’s Laws question' } ],
  4: [ { id: 5, text: 'Periodic table question' } ],
  5: [ { id: 6, text: 'Identify nouns' } ],
  6: [ { id: 7, text: 'Interpret poem' } ]
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {}
});

export default questionSlice.reducer;