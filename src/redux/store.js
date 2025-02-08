import {configureStore} from '@reduxjs/toolkit';
import switchReducer from './slices/switchSlice';

const store = configureStore({
  reducer: {
    switches: switchReducer,
  },
});

export default store;
