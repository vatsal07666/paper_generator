import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    formValues: {
        topicName: '',
        languageName: '',
        status: ''
    },
    openForm: false,
    searchItem: '',
    deleteOpen: false,
    deleteId: null,
    editId: null
}

export const TopicSlice = createSlice({
    name: "topic",
    initialState,
    reducers: {
        setTopic: (state, action) => {
            state.list = action.payload;
        },
        addTopic: (state, action) => {
            state.list.push(action.payload);
        },
        deleteTopic: (state, action) => {
            state.list = state.list.filter((s) => s._id !== action.payload);
        },
        updateTopic: (state, action) => {
            const index = state.list.findIndex(s => s._id === action.payload._id);
            if (index !== -1) state.list[index] = {...state.list[index], ...action.payload};
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
        },
    }
})

export const { setTopic, addTopic, setOpenForm, setSearchItem, setFormValues, resetFormValues, resetUIstate,
    setDeleteOpen, setDeleteId, resetDeleteState, deleteTopic, updateTopic, setEditId
} = TopicSlice.actions;
export default TopicSlice.reducer;