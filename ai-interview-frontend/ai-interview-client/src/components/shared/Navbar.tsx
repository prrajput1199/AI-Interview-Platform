import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { logout } from '../../store/slices/auth.slice';
import { Button } from '../ui/button';
import { useAppSelector } from '../../hooks/redux';
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  CreditCard, 
  User, 
  LogOut 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/history', label: 'History', icon: History },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/payment', label: 'Credits', icon: CreditCard },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            InterviewQAI
          </Link>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-2xl font-bold">
            InterviewQAI
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.name || user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}