import { useEffect, useState } from "react"
import { Badge } from "../ui/badge";

interface TimerProps {
    duration: number, //in minutes
    onTimeUp?: ()
}
export default function Timer({duration, onTimeUp}: TimerProps){
    

    const [timeLeft,setTimeLeft] = useState(duration * 60);

    useEffect(()=>{
       if(timeLeft <= 0) {
           onTimeUp?.();
           return;
       }

       const interval = setInterval(()=>{
          setTimeLeft((prev) => prev -1);
       }, 1000)


       return () => clearInterval(interval);
    }, [timeLeft, onTimeUp]);


    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft % 60;

    const getColor = () => {
        if(timeLeft > 120) return 'bg-green-500';
        if(timeLeft > 60) return 'bg-yellow-500';

        return 'bg-red-500';
    }

    return (
        <Badge variant="outline" className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getColor()} gap-2`}/>
            <span className="font-mono">
                {String(minutes).padStart(2, '0')}: {String(seconds).padStart(2,'0')}
            </span>
        </Badge>
    )
}