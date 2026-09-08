import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchInterview } from '../store/slices/interview.slice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Download } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export default function InterviewReport() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { currentInterview, isLoading } = useAppSelector((state) => state.interview);

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchInterview(interviewId));
    }
  }, [dispatch, interviewId]);

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/interviews/${interviewId}/report`,
        {
          credentials: 'include',
        }
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `interview-report-${interviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.add({
        title: 'Report downloaded',
        description: 'Your interview report has been downloaded.',
      });
    } catch (error) {
      toast.add({
        title: 'Download failed',
        description: 'Failed to download report. Please try again.',
      });
    }
  };

  if (isLoading || !currentInterview) {
    return <div className="container mx-auto px-4 py-8">Loading report...</div>;
  }

  const report = currentInterview.report;

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Report is still being generated...</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interview Report</h1>
        <Button onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold">{report.overallScore.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Out of 10</p>
            </div>
            <Badge variant={report.overallScore >= 7 ? 'default' : 'destructive'}>
              {report.overallScore >= 7 ? 'Great Job!' : 'Needs Improvement'}
            </Badge>
          </div>
          {report.summary && (
            <p className="mt-4 text-gray-700">{report.summary}</p>
          )}
        </CardContent>
      </Card>

      {/* Question Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentInterview.questions.map((q: any, index: number) => (
            <div key={q.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="font-medium">Q{index + 1}: {q.text}</p>
                <Badge variant="outline">{q.answer?.score?.toFixed(1) || 'N/A'}/10</Badge>
              </div>
              {q.answer?.text && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Your answer:</span> {q.answer.text}
                </p>
              )}
              {q.answer?.feedback && (
                <p className="mt-2 text-sm text-blue-600">
                  <span className="font-medium">AI Feedback:</span> {q.answer.feedback}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {report.strengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {report.weaknesses.map((weakness: string, index: number) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      {report.suggestions.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-blue-600">Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {report.suggestions.map((suggestion: string, index: number) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => navigate('/history')}>
          View All Interviews
        </Button>
        <Button onClick={() => navigate('/interview-setup')}>
          Practice Again
        </Button>
      </div>
    </div>
  );
}