import {
  createSlice
} from "@reduxjs/toolkit";


export const heroSlice = createSlice({
  name: "hero",
  initialState: {
    email: '',
    role: null,
    uid: '',
    loading: false,
    isLoggedIn: false,
    onBoardingComplete: false,
    error: {}
  },
  reducers: {
    heroRequest: (state) => {
      return {
        ...state,
        loading: true
      };
    },
    heroActionOnboarded: (state) => {
      return {
        ...state,
        onBoardingComplete: true,
        loading: false,
      };
    },
    heroActionSuccess: (state, action) => {
      return {
        ...state,
        ...action.payload.user,
        error: {},
        isLoggedIn: true,
        loading: false,
      };
    },
    heroActionFailure: (state, action) => {
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    }
  }
});
