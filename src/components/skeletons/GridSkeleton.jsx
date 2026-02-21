const GridSkeleton = ({ count = 8, SkeletonComponent }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  );
};

export default GridSkeleton;