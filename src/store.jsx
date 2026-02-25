import { configureStore } from '@reduxjs/toolkit';
import subjectReducer from './subjectSlice';
import topicReducer from './topicSlice';
import questionReducer from './questionSlice';

export const store = configureStore({
    reducer: {
        subjects: subjectReducer,
        topics: topicReducer,
        questions: questionReducer,
    },
});