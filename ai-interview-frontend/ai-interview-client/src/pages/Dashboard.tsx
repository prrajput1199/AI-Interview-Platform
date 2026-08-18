import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/redux';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'} </h1>
          <p className='text-gray-600'>Ready to practice for your next interview</p>
        </div>
        <Link to="/interview-setup">
          <Button>Start New Interview</Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interviews Taken</CardTitle>
            <CardDescription> Your Practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
            <CardDescription>Overall performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0/10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Available</CardTitle>
            <CardDescription>Ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default Dashboard;