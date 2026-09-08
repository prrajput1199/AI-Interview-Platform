import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  CreditCard, 
  User 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/history', label: 'History', icon: History },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/payment', label: 'Credits', icon: CreditCard },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-3 text-xs",
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}