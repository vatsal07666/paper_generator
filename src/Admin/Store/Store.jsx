import { configureStore } from "@reduxjs/toolkit";
import SubjectSlice from "../Subject/SubjectSlice";
import TopicSlice from "../Topic/TopicSlice";
import QuestionsSlice from "../Questions/QuestionsSlice";

export default configureStore({
    reducer: {
        subjectStore: SubjectSlice,
        topicStore: TopicSlice,
        questionStore: QuestionsSlice
    }
})