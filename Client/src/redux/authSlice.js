import {createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    userId : null,
    accessToken : null,
    refreshToken : null
}


const authSlice = createSlice({

    name : 'auth',
    initialState,

    reducers : {
        setUserId : (state, action) => {
            state.userId = action.payload;
        },

        setTokens : (state,action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },


        clearAuth : (state) => {
            state.userId = null;
            state.accessToken = null;
            state.refreshToken = null;
        }
    }




})


export const {setUserId, setTokens, clearAuth} = authSlice.actions;
export default authSlice.reducer;

