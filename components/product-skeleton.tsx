import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 rounded-md mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </CardFooter>
    </Card>
  )
}

