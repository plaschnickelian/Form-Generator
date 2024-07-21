import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import formReducer from '../features/form/formSlice'
import offertypeReducer from '../features/admin/offer-types/offertypeSlice'
import clientReducer from '../features/client/clientSlice'
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['form']
}


const rootReducer = combineReducers({
  user: userReducer,
  offertype: offertypeReducer,
  client: clientReducer,
  form: formReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, PERSIST, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
