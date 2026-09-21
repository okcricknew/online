export default function Header() {
  return (
    <div className="sticky top-0 z-50 bg-[#18a4e0] text-white shadow-md">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">☰</span>
          
          {/* Logo with Crown badge */}
          <div className="flex items-center bg-white text-black px-2 py-0.5 rounded-lg shadow-sm">
            <span className="text-xs mr-1">👑</span>
            <span className="font-black text-lg tracking-tight">Laksh</span>
            <span className="text-xs font-bold bg-black text-white px-1 rounded ml-1">365</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Wallet Balance Pill */}
          <div className="bg-black text-white rounded-full px-3 py-1 text-sm font-bold flex items-center gap-2 shadow-inner">
            <span>₹0.00</span>
            <div className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
              👛
            </div>
          </div>

          {/* Notification Bell */}
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs shadow-inner">
            🔔
          </div>
        </div>
      </div>

      {/* Marquee Text */}
      <div className="px-3 py-1 overflow-hidden whitespace-nowrap font-bold text-[11px] sm:text-xs tracking-wider text-white flex items-center gap-1">
        <span>📢</span>
        <span>WELCOME TO LAKSH 365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED</span>
      </div>

      {/* Starline & Jackpot Buttons (on Blue Background) */}
      <div className="grid grid-cols-2 gap-3 px-4 py-3">
        <button className="bg-white text-black rounded-full py-2.5 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
          <div className="w-6 h-6 rounded-full bg-[#18a4e0] flex items-center justify-center text-white text-xs">
            ▶
          </div>
          STARLINE
        </button>

        <button className="bg-white text-black rounded-full py-2.5 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
          <div className="w-6 h-6 rounded-full bg-[#18a4e0] flex items-center justify-center text-white text-xs">
            ▶
          </div>
          JACKPOT
        </button>
      </div>

      {/* White Container Card with Rounded Top Corners */}
      <div className="bg-white text-black rounded-t-[28px] px-4 pt-4 pb-3 shadow-lg">
        {/* Deposit, Withdraw, WhatsApp, Live Chat Row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💰
            </div>
            <span className="text-[10px] font-black text-gray-800 tracking-tight">DEPOSIT</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💳
            </div>
            <span className="text-[10px] font-black text-gray-800 tracking-tight">WITHDRAW</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              🟢
            </div>
            <span className="text-[10px] font-black text-gray-800 tracking-tight">WHATSAPP</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💬
            </div>
            <span className="text-[10px] font-black text-gray-800 tracking-tight">LIVE CHAT</span>
          </div>
        </div>
      </div>
    </div>
  );
        }
