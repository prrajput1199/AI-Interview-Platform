import { configureStore } from "@reduxjs/toolkit"
import authreducer from '../store/slices/auth.slice'
import userReducer from "../store/slices/user.slice"
import uiReducer from "../store/slices/ui.slice";
import interviewReducer from "../store/slices/interview.slice"
import { analyticsApi } from "./api/analytics.api";
import { paymentApi } from "./api/payment.api";
import { resumeApi } from "./api/resume.api";

export const store = configureStore({
    reducer: {
        auth: authreducer,
        user: userReducer,
        interview: interviewReducer,
        ui: uiReducer,
        [resumeApi.reducerPath]: resumeApi.reducer,
        [analyticsApi.reducerPath]: analyticsApi.reducer, // Add this
         [paymentApi.reducerPath]: paymentApi.reducer, // Add this
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            resumeApi.middleware,
            analyticsApi.middleware,
            paymentApi.middleware
        ),
});

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;