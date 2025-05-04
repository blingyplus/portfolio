import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  count?: number;
  type?: "project" | "blog";
}

export function SkeletonLoader({ count = 3, type = "project" }: SkeletonLoaderProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={type === "blog" ? "flex flex-col h-full" : "overflow-hidden"}>
          <Skeleton className="w-full h-48" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className={type === "blog" ? "flex-grow flex flex-col justify-between" : ""}>
            <div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              {type === "blog" && (
                <>
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
