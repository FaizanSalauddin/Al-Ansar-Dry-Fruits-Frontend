import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm">
      <Skeleton height={180} borderRadius={12} />
      <div className="mt-3 flex justify-center">
        <Skeleton height={16} width={120} />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;