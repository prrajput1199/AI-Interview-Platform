import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function InterviewReport(){
    return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
     <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">
            Interview Report
         </h1>
         <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4"/>
            Download PDF
         </Button>
     </div>
        
    <Card className="mb-6">
        <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between">
                    <p className="text-4xl font-bold">{report.overallScore.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">Out of 10</p>
                    <Badge variant={report.overallScore >= 7 ? "default" : "destructive"}>
                       {report.overallScore >= 7 ? "Great Job!" : " Needs Improvement"}
                    </Badge>
                </div>
                {report.summary && (<p className="mt-4 text-gray-700">{report.summary}</p>)}
            </div>

        </CardContent>
    </Card>
    </div>)
}