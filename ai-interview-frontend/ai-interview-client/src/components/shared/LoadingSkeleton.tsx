import { Skeleton } from "../ui/skeleton";

export function InterviewSessionSkeleton(){
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="space-y-4">
              <Skeleton className="h-[200px] w-full"/>
              <Skeleton className="h-[150px] w-full"/>
              <div className="flex justify-between">
                 <Skeleton className="h-10 w-32"/>
                 <Skeleton className="h-10 w-32"/>
              </div>
          </div>
        </div>
    )
}