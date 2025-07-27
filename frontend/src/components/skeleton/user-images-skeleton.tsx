import { Skeleton } from '../ui/skeleton';

type UserImagesSkeletonProps = {
  inputCount?: number;
};

const UserImagesSkeleton = ({ inputCount = 1 }: UserImagesSkeletonProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] gap-2">
      {[...Array(inputCount)].map((_, index) => (
        <div className="relative col-span-2 space-y-2" key={index}>
          <Skeleton className="aspect-square w-full rounded-md" />
          <Skeleton className="mx-auto h-5 w-3/4" />
        </div>
      ))}
    </div>
  );
};

export default UserImagesSkeleton;
