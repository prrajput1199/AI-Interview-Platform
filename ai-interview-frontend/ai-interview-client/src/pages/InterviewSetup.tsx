import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, useFormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useAppDispatch } from "@/hooks/redux";
import { createInterview } from "@/store/slices/interview.slice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod"
import useDropzone from "react-dropzone"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";


const formSchema = z.object({
    mode: z.string().min(1, "Please select an Interview Mode"),
    title: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const interviewModes = [
    { value: "FRONTEND", label: "Frontend Developer" },
    { value: "BACKEND", labek: "Backend Developer" },
    { value: "FULL_STACK", label: "Full Stack Developer" },
    { value: "REACT", label: "React Developer" },
    { value: "NODE", label: "Node.js Developer" },
    { value: "SYSTEM_DESIGN", label: "System Design" },
    { value: "DATABASE", label: "Database Interview" },
    { value: "DEVOPS", label: "DevOps Interview" },
    { value: "HR", label: "HR Interview" },
    { value: "BEHAVIOURAL", label: "Behavioral Interview" }
]


export default function InterviewSetup() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    // const [uploadResume] = useUploadResumeMutation();
    const { data: resumeData, refetch: refetchResume } = useGetResumeQuery(undefined, {
        skip: true
    })

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mode: "",
            title: ""
        }
    });
    

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if(!file) return;

        if(file.type !== 'application/pdf'){
            toast.add({
                title: "Invalid file type",
                description:"Please upload a PDF file"
            });
            return;
        }

        if(file.size > 5*1024*1024){
            toast.add({
                title:" File too large",
                description:"File size must be less than 5MB"
            })
            return;
        }

        setResumeFile(file);
        setIsUploading(true);

        const formData = new FormData();
        formData.append('resume',file);

        try {
            await uploadResume(formData).unwrap();
            await refetchResume();

            toast.add({
                title:"Resume uploaded",
                description:"Your Resume has been uploaded successfully"
            })
        } catch (error) {
            toast.add({
                title:"Upload failed",
                description:"Failed to upload resume. Please try again"
        })} 
        finally{
                setIsUploading(false)
          }
        }

    const {getRootProps, getInputProps,isDragActive} = useDropzone({
        onDrop,
        accept: {'application/pdf': ['.pdf']},
        maxFiles: 1
    })

    const onSubmit = async (data:FormValues)=> {
            try {
                const interview = await dispatch(createInterview({
                    mode:data.mode,
                    title:data.title || `${data.mode} Interview`
                })).unwrap();

                toast.add({
                    title:"Interview Created",
                    description:"Starting your interview..."
                });

                navigate(`/interview-session/${interview.id}`);
            } catch (error:any) {
                toast.add({
                    title:"Creation Failed",
                    description: error.message || 'failed to create Interview',
                })
            }
    }

    return (
        <>
            <div className="conatainer mx-auto px-4 py-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className=" text-2xl"> Interview Setup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-x-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField 
                                control={form.control} 
                                name="mode"
                                render={({field}) => (
                                     <FormItem>
                                        <FormLabel>
                                            Interview Type
                                        </FormLabel>
                                        <Select onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Intevriew mode"/>
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {interviewModes.map((mode)=>(
                                                <SelectItem key={mode.value} value={mode.value}>
                                                   {mode.label}
                                                </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                     </FormItem>
                                )}
                                >
                                </FormField>
                                <FormField
                                control={form.control}
                                name="title"
                                render={({field})=> (
                                <FormItem>
                                    <FormLabel>
                                       Interview Title (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Microsoft Frontend Interview" {...field}/>
                                    </FormControl>
                                </FormItem>)}
                                >
                                </FormField>
                                <div className="space-y-2">
                                   <FormLabel>
                                    Upload Resume(Optional)
                                   </FormLabel>
                                   <div 
                                   {...getRootProps()}
                                   className={`border-2 border-dashed rounded-lg p-8 text-center cursot-pointer transition-colors ${isDragActive ? 'border-blue-500  bg-blue-50' : 'border-gray-300'}`}>        
                                   <input {...getInputProps()}/>
                                   <div className = "space-y-2">
                                    {/* <div className ="text-4xl"></div> */}
                                    <p className ="text-gray=600">
                                        {isDragActive ? 'Drop your resume here' : 'Drag and drop your resume here, or click to select'}
                                    </p>
                                    <p className="text-sm text-gray-500"> PDF only (Max 5MB)</p>
                                    {resumeFile && (
                                        <Badge variant="secondary" className="mt-2">
                                            {resumeFile.name}
                                        </Badge>
                                    )}
                                    </div>    
                                   </div>
                                </div>

                                <Button type="submit" className="w-full" size="lg">
                                    Start Interview
                                </Button>
                            </form>
                        </Form>      
                    </CardContent>
                </Card>
            </div>
        </>
    )
}