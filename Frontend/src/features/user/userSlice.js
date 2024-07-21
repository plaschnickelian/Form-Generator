import { createSlice } from '@reduxjs/toolkit'
import { getUserDetails, userLogin } from './userActions'
import { disabilityAssistanceConfig } from '../../forms/BH/disabilityAssistanceConfig'
import { homelessAssistanceConfig } from '../../forms/WLH/homelessAssistanceConfig'
import { delinquentAssistanceConfig } from '../../forms/SFH/delinquentAssistanceConfig'

const userToken = localStorage.getItem('userToken')
  ? localStorage.getItem('userToken')
  : null

const initialState = {
  loading: false,
  userInfo: {},
  userToken: null,
  error: null,
  success: false,
  projectLocation: {},
  logoutNavigate: false,
  requestLogout: false,
  formConfig: {},
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      console.log("logging out...")
      localStorage.removeItem('userToken')
      state.loading = initialState.loading
      state.userInfo = initialState.userInfo
      state.userToken = initialState.userToken
      state.error = initialState.error
      state.projectLocation = initialState.projectLocation
      state.logoutNavigate = true
    },
    setLogoutNavigate: (state, action) => {
      state.logoutNavigate = action.payload;
    },
    setRequestLogout: (state, action) => {
      state.requestLogout = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;

      if (action.payload.userProject) {
        state.projectLocation = action.payload.userProject.projectLocation;
      }
    },
    setProjectLocation: (state, action) => {
      state.projectLocation = action.payload;
    }
  },
  extraReducers: (builder) => {
    //login user
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true
      state.error = null
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload
      state.userToken = payload.userToken

      if (payload.userProject) {
        const projectType = payload.userProject.projectType.id;

        switch (projectType) {
          case 1:
            state.formConfig = homelessAssistanceConfig;
            break;

          case 2:
            state.formConfig = disabilityAssistanceConfig;
            break;

          case 3:
            state.formConfig = delinquentAssistanceConfig;
            break;

          default:
            state.formConfig = {};
        }

        state.projectLocation = payload.userProject.projectLocation;
      }
    });
    builder.addCase(userLogin.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    });
    //benutzerdetails laden
    builder.addCase(getUserDetails.pending, (state) => {
      state.loading = true
    });
    builder.addCase(getUserDetails.fulfilled, (state, { payload }) => {
      state.loading = false
      state.userInfo = payload

      if (payload !== undefined) {
        if (payload.userProject) {
          state.projectLocation = payload.userProject.projectLocation;
        }
      }
    });
    builder.addCase(getUserDetails.rejected, (state, { payload }) => {
      state.loading = false
    });
  }
});

export const getUser = state => state.user.userInfo;
export const getToken = state => state.user.userToken;
export const getProjectLocation = state => state.user.projectLocation;
export const getFormConfig = state => state.user.formConfig;

export const { logout, setUserInfo, setProjectLocation, setLogoutNavigate, setRequestLogout } = userSlice.actions

export default userSlice.reducer
