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
      <div className="absolute inset-0 md:hidden bg-gradient-to-b from-black/40 via-black/30 to-black/10"></div>

      {/* ===== DESKTOP SOFT OVERLAY ===== */}
      <div className="absolute inset-0 hidden md:block bg-black/30"></div>

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
            text-white
            drop-shadow-[0_6px_25px_rgba(0,0,0,0.8)]
            font-extrabold
          "
        >
          Al-Ansar <br />
          <span className="text-[#F5E6C8]">
            Stores
          </span>
        </h1>

        {/* TAGLINE */}
        <p
          className="
            mt-4 sm:mt-5
            text-base sm:text-lg
            md:text-lg
            text-[#F5E6C8]
            tracking-wide
            font-semibold
            drop-shadow-md
          "
        >
          Finest Quality Dry Fruits
        </p>

        {/* DIVIDER */}
        <div className="w-24 h-[2px] bg-[#F5E6C8] mx-auto my-6"></div>

        {/* CTA */}
        <button
          onClick={() => navigate("/home")}
          className="
            bg-[#0F5132]
            text-white
            font-bold
            px-8 py-3
            rounded-full
            text-lg
            tracking-wide
            hover:bg-[#0C3F27]
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
