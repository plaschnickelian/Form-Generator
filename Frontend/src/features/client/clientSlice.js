import { createSlice } from "@reduxjs/toolkit";

export const clientSlice = createSlice({
    name: 'client',
    initialState: {
        selectedClient: null,
    },
    reducers: {
        setSelectedClient: (state, action) => {
            state.selectedClient = action.payload;
        }
    }
})

export const getSelectedClient = state => state.client.selectedClient;

export const { setSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;