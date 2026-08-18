import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchUserProfile } from "@/store/slices/user.slice";
// import { useToastManager } from "@base-ui/react";
import { useEffect, useState } from "react";

export default function Profile(){
    const dispatch = useAppDispatch();
    const {profile,isLoading} = useAppSelector((state) => state.user);
    const {user} = useAppSelector((state) => state.auth);
    // const {Toast} = useToast();

    const [name, setName] = useState('');
    const [ isEditing,setIsEditing] = useState(false);

    useEffect(() => {

        if (user) {
            dispatch(fetchUserProfile());
        }

    },[dispatch, user]);

    useEffect(() => {
        if(profile?.name){
            setName(profile.name);
        }
    },[profile]);

    if(isLoading){
        return <div className="container mx-auto px-4 py-8"> Loading...</div>
    }
    
    return (
      <div className = "container mx-auto ">
        
      </div>
    )

}