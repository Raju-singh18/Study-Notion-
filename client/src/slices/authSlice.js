import { createSlice } from "@reduxjs/toolkit";


const initialState ={
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")):null,
}

const authSlice =createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setSignupData(state, value) {
            state.signupData = value.payload;
          },
          setLoading(state, value) {
            state.loading = value.payload;
          },
        setToken(state,value){
            state.token=value.payload;
            localStorage.setItem("token", JSON.stringify(value.payload));
        },
        logout(state){
          state.token = null;
          localStorage.removeItem("token");
        },
    },
});

export const {setSignupData, setLoading, setToken, logout}=authSlice.actions;
export default authSlice.reducer;
