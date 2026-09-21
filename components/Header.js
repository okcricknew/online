export default function Header() {
  return (
    <div className="sticky top-0 z-50 bg-[#18a4e0] text-white shadow-md">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-3xl">☰</span>
          
          <div className="flex items-center gap-1">
            <h1 className="text-3xl font-black tracking-wide">
              Laksh
              <span className="text-white ml-1">
                365
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wallet Balance Pill */}
          <div className="bg-black text-white rounded-full px-3 py-1.5 text-sm font-bold flex items-center gap-2 shadow-inner">
            <span>₹0.00</span>
            <div className="bg-white text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">
              👛
            </div>
          </div>

          {/* Notification Bell */}
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-sm shadow-inner">
            🔔
          </div>
        </div>
      </div>

      {/* Marquee Text */}
      <div className="px-3 py-1 overflow-hidden whitespace-nowrap font-bold text-[11px] sm:text-xs tracking-wider text-white">
        WELCOME TO LAKSH 365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED
      </div>

      {/* White Container Card matching Screenshot */}
      <div className="bg-white text-black rounded-t-[28px] px-4 pt-4 pb-3 mt-2 shadow-lg">
        {/* Deposit, Withdraw, WhatsApp, Live Chat Row */}
        <div className="grid grid-cols-4 gap-2 mb-4 text-center">
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💰
            </div>
            <span className="text-[10px] font-black text-gray-700 tracking-tight">DEPOSIT</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💳
            </div>
            <span className="text-[10px] font-black text-gray-700 tracking-tight">WITHDRAW</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              🟢
            </div>
            <span className="text-[10px] font-black text-gray-700 tracking-tight">WHATSAPP</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💬
            </div>
            <span className="text-[10px] font-black text-gray-700 tracking-tight">LIVE CHAT</span>
          </div>
        </div>

        {/* Starline & Jackpot Buttons */}
        <div className="grid grid-cols-2 gap-3 pb-1">
          <button className="bg-white text-black border-2 border-black rounded-full py-2.5 font-black text-base flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
            <span className="text-black text-xs">▶</span> STARLINE
          </button>

          <button className="bg-white text-black border-2 border-black rounded-full py-2.5 font-black text-base flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform">
            <span className="text-black text-xs">▶</span> JACKPOT
          </button>
        </div>
      </div>
    </div>
  );
}
