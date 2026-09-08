import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { fetchInterviewHistory } from '../store/slices/interview.slice';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Calendar, Clock } from 'lucide-react';

interface InterviewHistoryItem {
  id: string;
  title: string;
  mode: string;
  status: string;
  score: number | null;
  createdAt: string;
  report: { overallScore: number } | null;
}

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<InterviewHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/interviews?page=1&limit=20`,
        { credentials: 'include' }
      );
      const data = await response.json();
      if (data.success) {
        setInterviews(data.data.interviews);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      case 'CREATED':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredInterviews = interviews.filter((interview) =>
    interview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.mode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interview History</h1>
        <Button onClick={() => navigate('/interview-setup')}>
          New Interview
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search interviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredInterviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No interviews found.</p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => navigate('/interview-setup')}
            >
              Start Your First Interview
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <Card key={interview.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{interview.mode}</Badge>
                      <Badge className={getStatusColor(interview.status)}>
                        {interview.status}
                      </Badge>
                    </div>
                    <p className="font-medium">{interview.title}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(interview.createdAt)}
                      </span>
                      {interview.report?.overallScore !== undefined && (
                        <span className="font-medium">
                          Score: {interview.report.overallScore.toFixed(1)}/10
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {interview.status === 'COMPLETED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/interview-report/${interview.id}`)}
                      >
                        View Report
                      </Button>
                    )}
                    {interview.status === 'IN_PROGRESS' && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/interview-session/${interview.id}`)}
                      >
                        Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}