import { useEffect, useRef, useState } from "react";
import { useLoader } from "../context/LoaderContext";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import userApi from "../api/userApi";

function Home() {
  const { setLoading } = useLoader();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ================= MOBILE CAROUSEL STATE ================= */
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const desktopScrollRef = useRef(null);
  const desktopIntervalRef = useRef(null);

  const filteredCategories = categories.filter(
    (c) => c !== "other"
  );

  const startDesktopScroll = () => {
    stopDesktopScroll();

    desktopIntervalRef.current = setInterval(() => {
      if (!desktopScrollRef.current) return;

      const el = desktopScrollRef.current;

      el.scrollLeft += 1; // 👉 speed (1 = smooth)

      // Infinite loop
      if (
        el.scrollLeft + el.clientWidth >=
        el.scrollWidth - 1
      ) {
        el.scrollLeft = 0;
      }
    }, 20); // smaller = smoother
  };

  const stopDesktopScroll = () => {
    if (desktopIntervalRef.current) {
      clearInterval(desktopIntervalRef.current);
    }
  };

  /* ================= MOBILE SLIDE ================= */
  const next = () =>
    setIndex((i) => (i + 1) % filteredCategories.length);

  const prev = () =>
    setIndex((i) =>
      (i - 1 + filteredCategories.length) %
      filteredCategories.length
    );

  const startAutoSlide = () => {
    stopAutoSlide();
    intervalRef.current = setInterval(next, 3500);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const onTouchStart = (e) => {
    stopAutoSlide();
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    if (delta < -50) prev();
    startAutoSlide();
  };

  const getItem = (offset) =>
    filteredCategories[
    (index + offset + filteredCategories.length) %
    filteredCategories.length
    ];

  /* ================= DATA ================= */
  useEffect(() => {
    if (filteredCategories.length > 5) {
      startDesktopScroll();
    }
    return stopDesktopScroll;
  }, [filteredCategories.length]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await userApi.get("/products");
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [setLoading]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await userApi.get("/products/categories");
      setCategories(data.categories || []);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (filteredCategories.length > 1) startAutoSlide();
    return stopAutoSlide;
  }, [filteredCategories.length]);

  return (
    <div className="bg-[#F5EFE6] min-h-screen">

      {/* ================= CATEGORIES ================= */}
      <section className="px-4 pb-12">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-6">
          Shop by Category
        </h2>

        {/* ================= MOBILE CAROUSEL ================= */}
        <div
          className="relative py-8 md:hidden overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button className="arrow left" onClick={prev}>‹</button>
          <button className="arrow right" onClick={next}>›</button>

          <div className="flex justify-center items-center gap-4">
            <div className="carousel side">
              <CategoryCard
                category={{
                  name: getItem(-1),
                  image: `/categories/${getItem(-1)}.jpg`,
                }}
              />
            </div>

            <div className="carousel active">
              <CategoryCard
                category={{
                  name: getItem(0),
                  image: `/categories/${getItem(0)}.jpg`,
                }}
              />
            </div>

            <div className="carousel side">
              <CategoryCard
                category={{
                  name: getItem(1),
                  image: `/categories/${getItem(1)}.jpg`,
                }}
              />
            </div>
          </div>
        </div>

        {/* ================= DESKTOP HORIZONTAL FLOW ================= */}
        {/* ================= DESKTOP HORIZONTAL FLOW (AUTO) ================= */}
        <div className="hidden md:block">
          <div
            ref={desktopScrollRef}
            onMouseEnter={stopDesktopScroll}
            onMouseLeave={startDesktopScroll}
            className="flex gap-6 overflow-x-scroll pb-4 no-scrollbar"
          >
            {[...filteredCategories, ...filteredCategories].map((cat, i) => (
              <div key={cat + i} className="min-w-[260px]">
                <CategoryCard
                  category={{
                    name: cat,
                    image: `/categories/${cat}.jpg`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="px-4 pb-12">
        <h2 className="text-2xl font-bold text-[#2F4F3E] mb-6">
          Best Sellers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
