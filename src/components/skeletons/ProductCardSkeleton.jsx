import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm">
      <Skeleton height={160} borderRadius={12} />
      <div className="mt-3 space-y-2">
        <Skeleton height={14} width="80%" />
        <Skeleton height={14} width="60%" />
        <Skeleton height={20} width="40%" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;