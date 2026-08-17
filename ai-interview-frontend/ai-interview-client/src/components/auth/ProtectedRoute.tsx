import { useAppSelector } from '@/hooks/redux';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps{
    children: React.ReactNode;
}

const ProtectedRoute = ({children}: ProtectedRouteProps) => {

 const {isAuthenticated,isloading} = useAppSelector((state) => state.auth);

 if(isloading){
    return <div>Loading...</div>
 }

 if(!isAuthenticated){
    return <Navigate to="/login" replace/> 
}


  return <>{children}</>
}

export default ProtectedRoute