import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, googleProvider } from '@/config/firebase';
import { useAppDispatch } from '@/hooks/redux'
import { loginWithGoogle } from '@/store/slices/auth.slice';
import { signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const HandleGoogleLogin = async () => {
      try {
        setLoading(true);
        const result = await signInWithPopup(auth,googleProvider);
        const idToken = await result.user.getIdToken();

        await dispatch(loginWithGoogle(idToken)).unwrap();
        navigate('/dashboard');
      } catch (error) {
        console.error("Login failed", error);
      }finally{
        setLoading(false)
      }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <Card>
         <CardHeader> 
            <CardTitle className = "text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
                 Sign in to continue your interview practise
            </CardDescription>
         </CardHeader>
         <CardContent>
          <Button 
             className="w-full"
             size="lg"
             onClick={HandleGoogleLogin}
             disabled={loading}>
              {loading ? "Loading..." : "Continue with Google"}
          </Button>
         </CardContent>
      </Card>
    </div>
  )
}

export default Login