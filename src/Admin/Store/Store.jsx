import { configureStore } from "@reduxjs/toolkit";
import LanguageSlice from "../Language/LanguageSlice";
import TopicSlice from "../Topic/TopicSlice";
import QuestionsSlice from "../Questions/QuestionsSlice";

export default configureStore({
    reducer: {
        languageStore: LanguageSlice,
        topicStore: TopicSlice,
        questionStore: QuestionsSlice
    }
})