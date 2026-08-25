import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addAnswer, clearInterview, completeInterview, fetchInterview, generateQuestions, setCurrentQuestion, submitAnswer } from '@/store/slices/interview.slice';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const InterviewSession = () => {
 const {interviewId} = useParams<{interviewId: string}>();
 const dispatch = useAppDispatch();
 const navigate = useNavigate();

 const {currentInterview, questions, currentQuestionIndex, isLoading} = useAppSelector((state) => state.interview);

 const [answer, setAnswer] = useState("");
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
        });

        return;
    }

    setIsSubmitting(true);
    try {
        const result = await dispatch(submitAnswer({
            interviewId: interviewId!,
            questionId: currentQuestion.id,
            answer
        })).unwrap();

        dispatch(addAnswer(result));

        if(currentQuestionIndex < questions.length -1){
            dispatch(setCurrentQuestion(currentQuestion + 1));
            setAnswer("");
            toast.add({
                title:"Answer Submitted",
                description:"Moving to next question"
            });
        }else{

            await dispatch(completeInterview(interviewId!)).unwrap();
            toast.add({
                title:"Interview Completed",
                description:"Your report is being generated ..."
            })
            navigate(`/interview-report/${interviewId}`);
        }
    } catch (error: any) {
        toast.add({
            title:"Submission Failed",
            description: error.messgae || "Failed to submit answer"
        })
    }finally{
        setIsSubmitting(false);
    }
 }

  return (
    <div className ="container mx-auto px-4 py-8 max-w-3xl">
          <Card>
             <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle className='text-xl'>
                        Interview Session
                    </CardTitle>
                    <Badge variant="outline">
                            Question {currentQuestionIndex + 1} of {questions.length}
                    </Badge>
                </div>
                <div className="space-y-2">
                    <Progress value={((currentQuestionIndex)/questions.length) * 100} className="h-2"/>
                    <p className ="text-sm text-gray-500">
                        {currentInterview.title || `${currentInterview.mode} Interview`}
                    </p>
                </div>
             </CardHeader>
             <CardContent className='space-y-6'>
               { currentQuestion ? ( <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className ="text-lg font-medium">
                        {currentQuestion.text}
                    </p>
                  </div>

                  <Textarea/>
                </>
                  ) : (<>
                  
                  </>)
              } 
             </CardContent>
          </Card>
    </div>
  )
}

export default InterviewSession