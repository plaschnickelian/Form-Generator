import { createSlice } from '@reduxjs/toolkit'

export const offertypeSlice = createSlice({
  name: 'offertype',
  initialState: {
    editOfferType: {}, // Wert der Tabellenzeile nach Edit
  },
  reducers: {
    setEditOfferType: (state, action) => {
      state.editOfferType = action.payload;
    },
  },
})

export const { setEditOfferType } = offertypeSlice.actions

export default offertypeSlice.reducer