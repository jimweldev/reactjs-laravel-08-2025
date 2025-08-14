import { Skeleton } from '../ui/skeleton';

type NotificationsSkeletonProps = {
  count?: number;
};

const NotificationsSkeleton = ({ count }: NotificationsSkeletonProps) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div className="hover:bg-muted flex items-center gap-2 p-2" key={index}>
          <Skeleton className="size-9 rounded-full" />

          <div className="min-w-0 flex-1">
            <Skeleton className="mb-2 h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationsSkeleton;
