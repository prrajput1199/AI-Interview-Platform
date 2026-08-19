import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchUserProfile, updateUserProfile } from "@/store/slices/user.slice";
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
    
    const handleUpdate = async() =>{
          try {
            await dispatch(updateUserProfile({name})).unwrap();
            setIsEditing(false);
            toast.add({
               type:"success",
               title:"Profile Updated",
               description:"Your profile has been updated successfully"
            });
          } catch (error) {
              toast.add({
                type:"error",
                title:"Update Failed",
                description: "Failed to update profile. Please try again."
              })
          }
    }

    if(isLoading){
        return <div className="container mx-auto px-4 py-8"> Loading...</div>
    }
    
    return (
      <div className = "container mx-auto px-4 py-8 max-w-2xl">
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">
                     Profile Settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatarUrl}/>
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                 </Avatar>
                 <div>
                    <p className="text-lg font-semibold">{profile?.name || user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                 </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    {isEditing ? (<div className ="space-y-4">
                        <Input id="name" value={name} onChange={(e)=> setName(e.target.value)}/>
                    </div>) : (<div className="space-x-2">
                        <Button onClick={handleUpdate}> Save Changes</Button>
                        <Button variant="outline" onClick={()=> setIsEditing(false)}> Cancel</Button>
                    </div>)}

                </div>
            </CardContent>
        </Card>
      </div>
    )

}