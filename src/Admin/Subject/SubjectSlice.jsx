import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    formValues: {
        subjectName: '',
        subjectCode: '',
        status: ''
    },
    openForm: false,
    searchItem: '',
    deleteOpen: false,
    deleteId: null,
    editId: null
}

export const SubjectSlice = createSlice({
    name: "subject",
    initialState,
    reducers: {
        setSubject: (state, action) => {
            state.list = action.payload;
        },
        addSubject: (state, action) => {
            state.list.push(action.payload);
        },
        deleteSubject: (state, action) => {
            state.list = state.list.filter((s) => s._id !== action.payload);
        },
        updateSubject: (state, action) => {
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
        }
    }
})

export const { setSubject, addSubject, setOpenForm, setSearchItem, setFormValues, resetFormValues, 
    resetUIstate, setDeleteOpen, setDeleteId, resetDeleteState, deleteSubject, updateSubject, setEditId
} = SubjectSlice.actions;
export default SubjectSlice.reducer;