import {configureStore} from "@reduxjs/toolkit"


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