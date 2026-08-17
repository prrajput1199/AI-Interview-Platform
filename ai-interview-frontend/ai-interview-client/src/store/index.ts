import {configureStore} from "@reduxjs/toolkit"
import authreducer from '../store/slices/auth.slice'

export const store = configureStore({
    reducer : {
        auth : authreducer,
        // user : userReducer,
        // interview: interviewReducer,
        // ui: uiReducer
    },
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;