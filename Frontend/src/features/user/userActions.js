import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { responseNotifyHandling } from '../../components/Error'
import apiConfig from '../../config/config'

export const userLogin = createAsyncThunk(
  'user/login',
  async ({ userMail, userPassword, rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${apiConfig.rest}/user/login`, { userMail, userPassword });
      // store user's token in local storage
      localStorage.setItem('userToken', data.userToken)
      localStorage.setItem('user', JSON.stringify(data));
      responseNotifyHandling("", 200, `Anmeldung erfolgreich`)
      return data
    } catch (err) {
      if (err.response.status === 429) {
        responseNotifyHandling(err.response, err.response.status, 'Zu viele unerfolgreiche Anmeldeversuche. Bitte versuchen sie es später noch einmal');
      }
      else {
        // return custom error message from API if any
        responseNotifyHandling(err.response, err.response.status, 'Ungültige Anmeldedaten');
      }
      return rejectWithValue(err);
    }
  }
)

export const getUserDetails = createAsyncThunk(
  `${apiConfig.rest}/user/getUserDetails`,
  async (arg, { getState, rejectWithValue }) => {
    try {
      //benutzerdaten vom store laden
      const { user } = getState()

      if (!user.userToken) {
        return {};
      }
      else {
        //usertoken wird in header geladen und an die api geschickt
        const config = {
          headers: {
            Authorization: `Bearer ${user.userToken}`,
          },
        }

        const { data } = await axios.get(`${apiConfig.rest}/user/profile`, config)
        localStorage.setItem('user', JSON.stringify(data));
        if (!data) {
          return {};
        }
        else {
          return data;
        }
      }
    } catch (err) {
      if (err.response.status === 401) {
        responseNotifyHandling(err.response, err.response.status, `Ungütlige Anmeldedaten`);
      }
      return rejectWithValue();
    }
  }
)