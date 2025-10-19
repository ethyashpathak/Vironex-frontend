import { createSlice } from "@reduxjs/toolkit";

const sideBarSlice = createSlice({
    name: "sideBar",

    initialState: {
      status: JSON.parse(sessionStorage.getItem("sidebarOpen")) ?? true
    },
       
    reducers: {
        toggleSideBar : (state) => {
           state.status = !state.status;
        },
        
    }

});
export const {toggleSideBar} = sideBarSlice.actions

export default sideBarSlice.reducer