export default function Header() {
  return (
    <div className="bg-[#0086cb] text-white">
      {/* Top Navbar */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl cursor-pointer">☰</span>
          <div className="flex items-center gap-1 font-bold text-xl tracking-wider">
            <span className="bg-white text-[#0086cb] px-1 rounded text-sm">👑</span>
            <span>Laksh <span className="font-light">365</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow">
            <span>₹0.00</span>
            <span className="bg-gray-100 rounded-full p-1 text-xs">👛</span>
          </div>
          <span className="text-xl cursor-pointer">🔔</span>
        </div>
      </div>

      {/* Ticker / Announcement Bar */}
      <div className="bg-[#0073ae] text-[11px] text-white py-1 px-4 overflow-hidden whitespace-nowrap">
        <p className="inline-block font-medium tracking-wide">
          TO LAKSH 365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS REACHED...
        </p>
      </div>

      {/* Starline & Jackpot Tabs */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <button className="bg-white text-gray-800 rounded-full py-2.5 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-md border border-gray-100 active:scale-95 transition-transform">
          <span className="w-6 h-6 rounded-full bg-[#0086cb] text-white flex items-center justify-center text-xs">▶</span>
          STARLINE
        </button>
        <button className="bg-white text-gray-800 rounded-full py-2.5 px-4 flex items-center justify-center gap-2 font-bold text-sm shadow-md border border-gray-100 active:scale-95 transition-transform">
          <span className="w-6 h-6 rounded-full bg-[#0086cb] text-white flex items-center justify-center text-xs">▶</span>
          JACKPOT
        </button>
      </div>
    </div>
  );
}
