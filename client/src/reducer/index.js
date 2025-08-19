
import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import loadingBarReducer from "../slices/loadingBarSlice";
import courseReducer from "../slices/courseSlice";
import viewCourseReducer from "../slices/viewCourseSlice"


const rootReducer = combineReducers({
    auth:authReducer,
    profile: profileReducer,
    cart: cartReducer,
    course:courseReducer,
    viewCourse:viewCourseReducer,
    loadingBar:loadingBarReducer,
});

export default rootReducer;
