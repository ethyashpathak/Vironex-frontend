import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",

    initialState: {
      status: false,
      userData: null
    },
       
    reducers: {
        login : (state , action) => {
           state.status = true;
           console.log("in slice ", action);
           
           // Store the user data correctly from the response structure
           // The API returns user data in data.data.user
           state.userData = action.payload?.data?.user || null;
           
           // Store tokens in localStorage for persistence and API calls
           if (action.payload?.data?.accessToken) {
               localStorage.setItem('accessToken', action.payload.data.accessToken);
           }
           if (action.payload?.data?.refreshToken) {
               localStorage.setItem('refreshToken', action.payload.data.refreshToken);
           }
        },
        logout : (state) => {
           state.status = false;
           state.userData = null;
           // Note: The logoutUser utility function will handle both 
           // clearing cookies via API call and removing localStorage tokens
           // We still clear localStorage here for redundancy
           localStorage.removeItem('accessToken');
           localStorage.removeItem('refreshToken');
        },
        // Add a new action to update tokens without changing user state
        setTokens: (state, action) => {
           // This action only updates tokens without affecting login state
           if (action.payload?.accessToken) {
               localStorage.setItem('accessToken', action.payload.accessToken);
           }
           if (action.payload?.refreshToken) {
               localStorage.setItem('refreshToken', action.payload.refreshToken);
           }
           // The logged in state and user data remain unchanged
        }
    }

});
export const {login, logout, setTokens} = authSlice.actions

export default authSlice.reducer