import { useNavigate } from "react-router-dom";

function BannerPage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* ===== MOBILE BACKGROUND ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url('/mobile_banner.png')" }}
      />

      {/* ===== DESKTOP BACKGROUND ===== */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden md:block"
        style={{ backgroundImage: "url('/banner.jpeg')" }}
      />

      {/* ===== MOBILE DARK GRADIENT OVERLAY ===== */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-b from-black/20 via-black/20 to-black/5"></div>

      {/* ===== DESKTOP SOFT OVERLAY ===== */}
      <div className="absolute inset-0 hidden md:block bg-black/10"></div>

      {/* ===== CONTENT ===== */}
      <div
        className="
          relative z-10 h-full flex flex-col items-center
          justify-start md:justify-center
          text-center px-4
          pt-28 sm:pt-32 md:pt-0
        "
      >
        {/* BRAND NAME */}
        <h1
          className="
            font-serif leading-tight
            text-5xl sm:text-6xl
            md:text-7xl lg:text-8xl
            text-black md:text-black
            drop-shadow-lg
            font-extrabold
          "
        >
          Al-Ansar <br />
          <span className="text-[#000000] md:text-[#090500]">
            Stores
          </span>
        </h1>

        {/* TAGLINE */}
        <p
          className="
            mt-4 sm:mt-5
            text-base sm:text-lg
            md:text-lg
            text-black md:text-black
            tracking-wide
            font-semibold
          "
        >
          Finest Quality Dry Fruits
        </p>

        {/* DIVIDER */}
        <div className="w-24 h-[2px] bg-black md:bg-black mx-auto my-6"></div>

        {/* CTA */}
        <button
          onClick={() => navigate("/home")}
          className="
            bg-[#021c0e]
            text-white
            font-bold
            px-8 py-3
            rounded-full
            text-lg
            tracking-wide
            hover:bg-[#243C30]
            transition
            shadow-2xl
          "
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default BannerPage;
