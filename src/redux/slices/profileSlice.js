import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  name: "John Monroe",
  email: "john@figma.com",
  phone: "+1 234 567 890",
  dob: "1995-08-16",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
