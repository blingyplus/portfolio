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
        <Card key={index} className="h-full flex flex-col">
          {type === "project" && <Skeleton className="w-full h-48" />}
          <CardHeader className="p-4 sm:p-6">
            {/* Tall skeleton for blog title, normal for project */}
            <Skeleton className={type === "blog" ? "h-10 w-3/4 mb-2" : "h-6 w-3/4"} />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
            <div>
              {/* Blog: 2-3 lines for excerpt, Project: 1-2 lines */}
              {type === "blog" ? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </>
              ) : (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                </>
              )}
            </div>
            {/* Bottom row: left and right skeletons */}
            <div className="flex justify-between items-center mt-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
