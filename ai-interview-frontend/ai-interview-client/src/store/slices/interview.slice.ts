import axiosInstance from "@/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

