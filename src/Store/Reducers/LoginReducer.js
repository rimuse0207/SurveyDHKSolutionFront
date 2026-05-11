// src/store/auth/reducer.js

// 1. Action Types
const LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
const LOGOUT = "auth/LOGOUT";

// 2. Action Creators
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});

// 3. Initial State
const initialState = {
  isAdmin: false,
  user: null,
  loading: false,
};

// 4. Reducer
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAdmin: true,
        user: action.payload,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        isAdmin: false,
        user: null,
      };
    default:
      return state;
  }
}
