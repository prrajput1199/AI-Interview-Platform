import { useAppSelector } from '@/hooks/redux';
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { logout } from '@/store/slices/auth.slice';


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, user } = useAppSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await dispatch(logout()).unwrap();
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error)
        }
    }
    return (
        <nav className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className='text-2xl font-bold'>
                    InterviewQAI
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (<>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/profile">
                            <span className='text-sm'>
                                {user?.name || "Profile"}
                            </span></Link>
                        <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                    </>) : (<Link to="/login">
                        <Button>Login</Button>
                    </Link>)}

                </div>
            </div>
        </nav>
    )
}

export default Navbar