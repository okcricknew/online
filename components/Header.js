export default function Header() {
  return (
    <div className="sticky top-0 z-50 bg-[#18a4e0] text-white shadow-md rounded-b-[35px] overflow-hidden">
      {/* Mobile Status Bar (Time, Battery & Network) */}
      <div className="flex justify-between items-center px-6 pt-2 pb-1 text-xs font-semibold">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span>📶</span>
          <span>🛜</span>
          <span>🔋 100%</span>
        </div>
      </div>

      <div className="flex justify-between items-center px-4 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☰</span>

          <h1 className="text-4xl font-black">
            Laksh
            <span className="text-gray-200">
              365
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-black rounded-full px-4 py-2 text-xl font-bold">
            ₹0.00
          </div>

          <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center">
            🔔
          </div>
        </div>
      </div>

      <div className="px-2 mt-2 overflow-hidden whitespace-nowrap font-bold text-lg">
        WELCOME TO LAKSH365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 py-4 pb-6">
        <button className="bg-white text-black border-2 border-black rounded-[24px] py-3 font-black text-2xl">
          ▶ STARLINE
        </button>

        <button className="bg-white text-black border-2 border-black rounded-[24px] py-3 font-black text-2xl">
          ▶ JACKPOT
        </button>
      </div>
    </div>
  );
}
