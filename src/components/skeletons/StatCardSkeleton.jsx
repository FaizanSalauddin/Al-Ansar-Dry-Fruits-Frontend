import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const StatCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <Skeleton width={32} height={32} />
      <div className="mt-3">
        <Skeleton width={80} height={14} />
      </div>
      <div className="mt-2">
        <Skeleton width={100} height={24} />
      </div>
    </div>
  );
};

export default StatCardSkeleton;