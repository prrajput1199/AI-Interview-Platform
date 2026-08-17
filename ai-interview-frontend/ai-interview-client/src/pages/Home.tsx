import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAppSelector } from '../hooks/redux';

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">InterviewQAI</div>
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AI Powered Smart Interview Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice interviews with AI intelligence. Role-based mock interviews
            with smart follow-ups, adaptive difficulty and real-time performance evaluation.
          </p>
          <div className="space-x-4">
            <Link to={isAuthenticated ? "/interview-setup" : "/login"}>
              <Button size="lg">Start Interview</Button>
            </Link>
            {isAuthenticated && (
              <Link to="/history">
                <Button variant="outline" size="lg">View History</Button>
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Role & Experience Selection</h3>
                <p className="text-gray-600">AI adjusts difficulty based on selected job role</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Smart Voice Interview</h3>
                <p className="text-gray-600">Dynamic follow-up questions based on your answers</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Timer Based Simulation</h3>
                <p className="text-gray-600">Real interview pressure with time tracking</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}