import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
    name: 'form',
    initialState: {
        formState: "UNCHANGED",
        errors: {},
        formCheckDone: "",
        currentAge: "",
    },
    reducers: {
        setFormState: (state, action) => {
            state.formState = action.payload;
        },
        setErrors: (state, action) => {
            state.errors = action.payload;
        },
        setFormCheckDone: (state, action) => {
            state.formCheckDone = action.payload;
        },
        setCurrentAge: (state, action) => {
            state.currentAge = action.payload;
        },
    }
})

export const FormState = {
    UNCHANGED: "UNCHANGED",
    MODIFIED: "MODIFIED",
    SAVING: "SAVING"
}

export const FormCheckDoneOptions = {
    CHECKED: "checked",
    CHECKING: "checking"
}

export const getFormState = state => state.form.formState;
export const getErrors = state => state.form.errors;
export const getFormCheckDone = state => state.form.formCheckDone;
export const getCurrentAge = state => state.form.currentAge;

export const { setFormState, setErrors, setFormCheckDone, setCurrentAge } = formSlice.actions;
export default formSlice.reducer;