function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5EFE6]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 rounded-full border-4 border-[#2F4F3E] border-t-transparent animate-spin"></div>

        {/* Brand text */}
        <p className="text-[#2F4F3E] text-lg font-semibold tracking-wide">
          Al-Ansar Stores
        </p>
      </div>
    </div>
  );
}

export default Loader;
