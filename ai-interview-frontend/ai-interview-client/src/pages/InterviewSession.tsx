import { toast } from '@/components/ui/toast';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { clearInterview, fetchInterview, generateQuestions } from '@/store/slices/interview.slice';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const InterviewSession = () => {
 const {interviewId} = useParams<{interviewId: string}>();
 const dispatch = useAppDispatch();
 const navigate = useNavigate();

 const {currentInterview, questions, currentQuestionIndex, isLoading} = useAppSelector((state) => state.interview);

 const [answer, setAnswer] = useState();
 const [isSubmitting, setIsSubmitting] = useState(false);
 

 useEffect(()=>{
    if(interviewId){
        dispatch(fetchInterview(interviewId));
    }

    return () => {
        dispatch(clearInterview())
    }
 })

 useEffect(()=>{
    if(currentInterview && questions.length === 0 && currentInterview.status === "CREATED"){
        dispatch(generateQuestions(interviewId!));
    }
 },[currentInterview,questions,dispatch,interviewId])

 const currentQuestion = questions[currentQuestionIndex];

 const handleSubmitAnswer = async () => {
    if(!answer.trim()){
        toast.add({
            title:"Empty answer",
            description:"Please provide an answer before submitting"
        })
    }

    // setIsSubmitting(true);
    // try {
    //     const 
    // } catch (error) {
        
    // }
 }

  return (
    <div>InterviewSession</div>
  )
}

export default InterviewSession