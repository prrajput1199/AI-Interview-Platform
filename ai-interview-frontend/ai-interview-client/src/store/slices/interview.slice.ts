import axiosInstance from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InterviewState {
 currentInterview: any | null;
 questions: any[];
 currentQuestionIndex: number;
 answers: any[];
 isLoading: boolean;
 error: string | null;
}

const initialState: InterviewState = {
    currentInterview: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    isLoading: false,
    error: null
}

export const createInterview = createAsyncThunk(
    'interview/create',
    async (data: { mode: string; title?: string; resumeId?: string})=>{
        const response = await axiosInstance.post('interviews',data);
        return response.data.data;
    }
)

export const generateQuestions = createAsyncThunk(
    'interview/generateQuestion',
    async (interviewId: string) => {
        const response = await axiosInstance.post(`/interviews/${interviewId}/generate`);
        return response.data.data;
    } 
)

export const fetchInterview= createAsyncThunk(
    'interview/fetch',
    async (interviewId: string) => {
        const response = await axiosInstance.get(`/intevriews/${interviewId}`);
        return response.data.data;
    }
);


const interviewSlice = createSlice({
    name:'interview',
    initialState,
    reducers: {
        setCurrentQuestion: (state,action) => {
            state.currentQuestionIndex = action.payload
        },
        clearInterview: (state) => {
            state.currentInterview = null;
            state.questions = [];
            state.currentQuestionIndex = 0;
            state.answers =[]
        },
        addAnswer: (state,action) => {
            state.answers.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(createInterview.pending, (state)=>{
            state.isLoading = true;
          })
          .addCase(createInterview.fulfilled,(state,action) => {
             state.isLoading = false;
             state.currentInterview = action.payload;
          })
          .addCase(createInterview.rejected,(state,action)=>{
               state.isLoading= false;
               state.error = action.error.message || 'Failed tpo create interview'
          })
          .addCase(generateQuestions.fulfilled,(state,action) => {
              state.questions = action.payload;
          })
          .addCase(fetchInterview.fulfilled,(state,action) => {
              state.currentInterview = action.payload;
              state.questions = action.payload.questions || []
          })
    }
})
