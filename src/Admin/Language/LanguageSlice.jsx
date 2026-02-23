import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    list: [],
    formValues: {
        languageName: '',
        languageCode: '',
        status: ''
    },
    openForm: false,
    searchItem: '',
    deleteOpen: false,
    deleteId: null,
    editId: null
}

export const LanguageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.list = action.payload;
        },
        addLanguage: (state, action) => {
            state.list.push(action.payload);
        },
        deleteLanguage: (state, action) => {
            state.list = state.list.filter((l) => l._id !== action.payload);
        },
        updateLanguage: (state, action) => {
            const index = state.list.findIndex(l => l._id === action.payload._id);
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

export const { setLanguage, addLanguage, setOpenForm, setSearchItem, setFormValues, resetFormValues, resetUIstate,
    setDeleteOpen, setDeleteId, resetDeleteState, deleteLanguage, updateLanguage, setEditId
} = LanguageSlice.actions;
export default LanguageSlice.reducer;