import { useEffect, useRef, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
import CategorySkeleton from "../components/skeletons/CategoryCardSkeleton";
import { Flame, Tag } from "lucide-react";
import userApi from "../api/userApi";

function Home() {


  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ LOCAL LOADING STATES
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  /* ================= STATES & REFS ================= */
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const desktopScrollRef = useRef(null);
  const desktopIntervalRef = useRef(null);
  const bestSellerRef = useRef(null);
  const bestSellerInterval = useRef(null);

  const filteredCategories = categories.filter((c) => c !== "other");

  /* ================= DATA FETCHING ================= */
  useEffect(() => {
    const fetchData = async () => {
      setProductsLoading(true);
      setCategoriesLoading(true);

      try {
        const [prodRes, catRes] = await Promise.all([
          userApi.get("/products"),
          userApi.get("/products/categories"),
        ]);

        setProducts(prodRes.data || []);
        setCategories(catRes.data.categories || []);
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setProductsLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= SCROLL LOGIC ================= */
  const startDesktopScroll = useCallback(() => {
    if (desktopIntervalRef.current)
      clearInterval(desktopIntervalRef.current);

    desktopIntervalRef.current = setInterval(() => {
      const el = desktopScrollRef.current;
      if (el) {
        el.scrollLeft += 1;
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) el.scrollLeft = 0;
      }
    }, 30);
  }, []);

  const startBestSellerScroll = useCallback(() => {
    if (bestSellerInterval.current)
      clearInterval(bestSellerInterval.current);

    bestSellerInterval.current = setInterval(() => {
      const el = bestSellerRef.current;
      if (el) {
        el.scrollLeft += 1;
        const halfWidth = el.scrollWidth / 2;
        if (el.scrollLeft >= halfWidth) el.scrollLeft = 0;
      }
    }, 30);
  }, []);

  const stopIntervals = () => {
    if (desktopIntervalRef.current)
      clearInterval(desktopIntervalRef.current);
    if (bestSellerInterval.current)
      clearInterval(bestSellerInterval.current);
  };

  /* ================= MOBILE CAROUSEL ================= */
  const next = useCallback(
    () =>
      setIndex((i) => (i + 1) % filteredCategories.length),
    [filteredCategories.length]
  );

  const prev = () =>
    setIndex(
      (i) =>
        (i - 1 + filteredCategories.length) %
        filteredCategories.length
    );

  useEffect(() => {
    if (filteredCategories.length > 1) {
      intervalRef.current = setInterval(next, 3500);
    }
    return () => clearInterval(intervalRef.current);
  }, [filteredCategories.length, next]);

  useEffect(() => {
    if (filteredCategories.length > 5) startDesktopScroll();
    if (products.length > 4) startBestSellerScroll();
    return stopIntervals;
  }, [
    filteredCategories.length,
    products.length,
    startDesktopScroll,
    startBestSellerScroll,
  ]);

  const onTouchStart = (e) => {
    clearInterval(intervalRef.current);
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const delta =
      touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    if (delta < -50) prev();
    intervalRef.current = setInterval(next, 3500);
  };

  const getItem = (offset) => {
    if (filteredCategories.length === 0) return "";
    return filteredCategories[
      (index + offset + filteredCategories.length) %
      filteredCategories.length
    ];
  };

  const bestSellers = products.slice(0, 8);

  return (
    <div className="bg-[#F5EFE6] min-h-screen pb-8">
      {/* ================= CATEGORIES ================= */}
      <section className="px-4 md:px-6 pb-10 pt-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2F4F3E]/10 rounded-lg">
              <Tag className="text-[#2F4F3E]" size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2F4F3E]">
              Shop By Category
            </h2>
          </div>
        </div>
        {/* MOBILE CAROUSEL */}
        <div
          className="relative py-8 md:hidden overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {categoriesLoading ? (
            <div className="flex justify-center gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          ) : filteredCategories.length > 0 ? (
            <div className="flex justify-center items-center gap-4">
              <div className="carousel side opacity-50 scale-90">
                <CategoryCard
                  category={{
                    name: getItem(-1),
                    image: `/categories/${getItem(-1)}.jpg`,
                  }}
                />
              </div>

              <div className="carousel active scale-110 z-10">
                <CategoryCard
                  category={{
                    name: getItem(0),
                    image: `/categories/${getItem(0)}.jpg`,
                  }}
                />
              </div>

              <div className="carousel side opacity-50 scale-90">
                <CategoryCard
                  category={{
                    name: getItem(1),
                    image: `/categories/${getItem(1)}.jpg`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
        {/* ✅ DESKTOP */}
        <div className="hidden md:block">
          <div
            ref={desktopScrollRef}
            onMouseEnter={() =>
              clearInterval(desktopIntervalRef.current)
            }
            onMouseLeave={startDesktopScroll}
            className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
          >
            {categoriesLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <CategorySkeleton key={i} />
              ))
              : [...filteredCategories, ...filteredCategories].map(
                (cat, i) => (
                  <div key={i} className="min-w-[260px]">
                    <CategoryCard
                      category={{
                        name: cat,
                        image: `/categories/${cat}.jpg`,
                      }}
                    />
                  </div>
                )
              )}
          </div>
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section className="px-4 md:px-6 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Flame className="text-orange-600" size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2F4F3E]">
            Best Sellers
          </h2>
        </div>

        <div
          ref={bestSellerRef}
          onMouseEnter={() =>
            clearInterval(bestSellerInterval.current)
          }
          onMouseLeave={startBestSellerScroll}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-5 px-1 scroll-smooth"
        >
          {productsLoading
            ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[240px] md:min-w-[260px]"
              >
                <ProductCardSkeleton />
              </div>
            ))
            : [...bestSellers, ...bestSellers].map((p, i) => (
              <div
                key={i}
                className="min-w-[240px] md:min-w-[260px]"
              >
                <ProductCard product={p} />
              </div>
            ))}
        </div>
      </section>

      {/* ================= PRODUCT GRID ================= */}
      <section className="px-4 pb-16">
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <p className="text-lg text-gray-600">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;