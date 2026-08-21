import { useAppDispatch } from "@/hooks/redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {z} from "zod"


const formSchema = z.object({
    mode: z.string.min(1,"Please select an Interview Mode"),
    title: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const interviewModes = [
    {value:"FRONTEND",label:"Frontend Developer"},
    {value:"BACKEND",labek:"Backend Developer"},
    {value:"FULL_STACK",label:"Full Stack Developer"},
    {value:"REACT",label:"React Developer"},
    {value:"NODE",label:"Node.js Developer"},
    {value:"SYSTEM_DESIGN",label:"System Design"},
    {value:"DATABASE",label:"Database Interview"},
    {value:"DEVOPS",label:"DevOps Interview"},
    {value:"HR", label:"HR Interview"},
    {value:"BEHAVIOURAL", label:"Behavioral Interview"}
]


export default function InteterviewSetup(){
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [resumeFile, setResumeFile ] = useState< File | null >(null);

    const [uploadResume] = useUploadResumeMutation();
    const { data: resumeData, refetch: refetchResume} = useGetResumeQuery(undefined, {
        skip: true
    })

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            mode:"",
            title:""
        }
    })

}