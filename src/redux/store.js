import {configureStore} from '@reduxjs/toolkit';
import switchReducer from './slices/switchSlice';
import profileReducer from './slices/profileSlice';

const store = configureStore({
  reducer: {
    switches: switchReducer,
    profile: profileReducer,
  },
});

export default store;
