import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useAppDispatch } from "@/hooks/redux";
import { createInterview } from "@/store/slices/interview.slice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod"


const formSchema = z.object({
    mode: z.string.min(1, "Please select an Interview Mode"),
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


export default function InteterviewSetup() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const [uploadResume] = useUploadResumeMutation();
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

    const onSubmit =async (data:FormValues)=>{
            try {
                const interview = await dispatch(createInterview({
                    mode:data.mode,
                    title:data.title || `${data.mode} Interview`
                })).unwrap();

                toast.add({
                    title:"Interview Created",
                    description:"Starting your interview..."
                })
            } catch (error:any) {
                toast.add({
                    title:"Creation Failed",
                    description: error.message || 'failed to create Interview'
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
                                {/* <FormField
                                control={form.control}
                                name="title"

                                >

                                </FormField> */}
                            </form>
                        </Form>      
                    </CardContent>
                </Card>
            </div>
        </>
    )
}