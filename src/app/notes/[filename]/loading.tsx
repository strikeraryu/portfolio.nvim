import Skeleton from '../../components/Skeleton';

export default function Loading() {
  return (
    <div className="page-content space-y-4 p-8">
      <div className="space-y-2">
        <Skeleton height="2rem" width="60%" />
        <Skeleton height="1rem" width="40%" />
      </div>
      <div className="space-y-3 mt-8">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} height="0.8rem" />
        ))}
      </div>
    </div>
  );
} 