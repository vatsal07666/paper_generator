import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    formValues: {
        subjectName: '',
        topicName: '',
        question: '',
        marks: ''
    },
    openForm: false,
    searchItem: '',
    deleteOpen: false,
    deleteId: null,
    editId: null
}

export const QuestionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        setQuestion: (state, action) => {
            state.list = action.payload;
        },
        addQuestion: (state, action) => {
            state.list.push(action.payload);
        },
        deleteQuestion: (state, action) => {
            state.list = state.list.filter((q) => q._id !== action.payload);
        },
        updateQuestion: (state, action) => {
            const index = state.list.findIndex((item) => item._id === action.payload._id);
            if(index !== -1) state.list[index] = { ...state.list[index], ...action.payload };
        },

        setFormValues: (state, action) => {
            state.formValues = action.payload;        
        },
        resetFormValues: (state) => {
            state.formValues = initialState.formValues;
        },

        setEditId: (state, action) => {
            state.editId = action.payload;
        },

        resetUIstate: (state) => {
            state.openForm = false;
            state.editId = null;
        },

        setOpenForm: (state, action) => {
            state.openForm = action.payload;
        },
        setDeleteOpen: (state, action) => {
            state.deleteOpen = action.payload;
        },
        setDeleteId: (state, action) => {
            state.deleteId = action.payload;
        },
        resetDeleteState: (state) => {
            state.deleteOpen = false;
            state.deleteId = null;
        },

        setSearchItem: (state, action) => {
            state.searchItem = action.payload;
        }
    }
})

export const { setQuestion, addQuestion, deleteQuestion, updateQuestion, setFormValues, resetFormValues, 
    setEditId, resetUIstate, setOpenForm, setDeleteOpen, setDeleteId, resetDeleteState, setSearchItem
} = QuestionsSlice.actions;
export default QuestionsSlice.reducer;