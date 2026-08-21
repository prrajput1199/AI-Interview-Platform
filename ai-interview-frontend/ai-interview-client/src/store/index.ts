import {configureStore} from "@reduxjs/toolkit"
import authreducer from '../store/slices/auth.slice'
import userReducer from "../store/slices/user.slice"
import uiReducer from "../store/slices/ui.slice";
import interviewReducer from "../store/slices/interview.slice"

export const store = configureStore({
    reducer : {
        auth : authreducer,
        user : userReducer,
        interview: interviewReducer,
        ui: uiReducer
    },
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;